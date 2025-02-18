#include <Arduino.h>
#include <ESP32Servo.h>
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <NTPClient.h>
#include <HTTPClient.h>


#define BUZZER_PIN   14 
#define GREEN_LED    26 
#define RED_LED      25 
#define RELAY_PIN    27 
#define SERVO_PIN    13

Servo servo; 

#define AWS_IOT_PUBLISH_TOPIC   "molinete/pub"
#define AWS_IOT_PUBLISH_TOPIC2   "molinete/servo/pub"
#define AWS_IOT_PUBLISH_TOPIC3   "molinete/rfid/pub"
#define AWS_IOT_PUBLISH_TOPIC4   "molinete/infrarojo/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "molinete/sub"

WiFiClientSecure net;
PubSubClient client(net);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "id.pool.ntp.org");

void connectToWifi(){
  WiFi.mode(WIFI_STA);
  WiFi.begin("Wokwi-GUEST", "");

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
}

void connectAWS()
{

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);

  // Create a message handler
  //client.setCallback(messageHandler);

  Serial.println("Connecting to AWS IoT");

  while (!client.connected())
  {
    Serial.print(".");
    if (client.connect(THINGNAME))
    {
      Serial.println("Connected to AWS IoT");
      //client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
    }
    else
    {
      Serial.println("AWS IoT Connection Failed! Retrying...");
      delay(100);
    }
  }
}

void publishRFIDData(int cardID, bool access, int puerta)
{
  if (!client.connected()) {
    Serial.println("MQTT Disconnected! Reconnecting...");
    connectAWS();  
  }
  Serial.println("Publicando ingreso a IOTCORE...");
  StaticJsonDocument<200> doc;
  //doc["hora"] = timeClient.getEpochTime() + (7 * 3600);  
  doc["ingreso"] = access;
  doc["id"] = cardID;
  doc["puerta"] = puerta;
  char jsonBuffer[512];

  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC3, jsonBuffer);
  Serial.println("Mensaje publicado!");
}


void setup() {
  Serial.begin(115200); 
  connectToWifi();
  connectAWS();
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(RELAY_PIN, LOW);

  servo.attach(SERVO_PIN); 
  servo.write(0);

  timeClient.begin();
  timeClient.setTimeOffset(0);
}

void loop() {
  
  client.loop();
  timeClient.update();
  
  if (Serial.available()) {
    Serial.println("Enter e-KTP ID (format: XX XX XX XX):");
    String input = Serial.readStringUntil('\n');
    input.trim(); 
    Serial.println("CardID: " + input);
    
    int cardID = validateCard(input);
    bool access = cardID > -1;

    if (access) { 
      accessGranted();
    } else {
      accessDenied();
    }

    publishRFIDData(cardID, access, 1);
  }
}


int validateCard(String cardID) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");

    // Prepare JSON payload
    String payload = "{\"id\":\"" + cardID + "\"}";

    Serial.println("Validating card: " + cardID);
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Response: " + response);
        http.end();

        // Parse the outer JSON response (statusCode and body)
        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, response);

        if (!error && doc.containsKey("body")) {
            // Extract the 'body' JSON string
            String body = doc["body"].as<String>();

            // Parse the 'body' as a separate JSON object
            StaticJsonDocument<200> bodyDoc;
            DeserializationError bodyError = deserializeJson(bodyDoc, body);

            if (!bodyError && bodyDoc.containsKey("card_id")) {
                // Ensure the card_id is returned as an integer
                int cardID = bodyDoc["card_id"].as<int>();
                return cardID;  // Return the card ID from the response
            } else {
                Serial.println("Invalid body response format");
                return -1;  // Return -1 if card_id is not found in body
            }
        } else {
            Serial.println("Invalid outer response format");
            return -1;  // Return -1 if 'body' is not found
        }
    } else {
        Serial.println("HTTP Request Failed");
        http.end();
        return -1;  // Return -1 if HTTP request failed
    }
}




void accessGranted() {
  Serial.println("Access granted!");
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(RELAY_PIN, HIGH);
  
  
  servo.write(90); 
  delay(5000); 
  
  servo.write(0); 
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RELAY_PIN, LOW);
}

void accessDenied() {
  Serial.println("Access denied!");
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(RED_LED, HIGH);
  delay(5000);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RED_LED, LOW);
}
