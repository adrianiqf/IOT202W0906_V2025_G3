#include <Arduino.h>
#include <ESP32Servo.h>
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <NTPClient.h>

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

bool ingreso = false;
String pin = " ";
int angulo = 0;
unsigned long previousMillis = 0; // Stores last time the timer was updated
const long interval = 1000; // Interval at which to trigger (in milliseconds)



WiFiClientSecure net;
PubSubClient client(net);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "id.pool.ntp.org");

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin("Wokwi-GUEST", "");

  Serial.println("Connecting to Wi-Fi EHEM");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);

  // Create a message handler
  client.setCallback(messageHandler);

  Serial.println("Connecting to AWS IoT");

  while (!client.connected())
  {
    Serial.print(".");
    if (client.connect(THINGNAME))
    {
      Serial.println("Connected to AWS IoT");
      client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
    }
    else
    {
      Serial.println("AWS IoT Connection Failed! Retrying...");
      delay(1000);
    }
  }
}

void publishMessage()
{
  
  StaticJsonDocument<200> doc;
  doc["timestamp"] = timeClient.getEpochTime() + (7 * 3600);  
  doc["ingreso"] = ingreso;
  doc["id"] = pin;
  char jsonBuffer[512];

  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  
}

void publishMessage2()
{
  
  StaticJsonDocument<200> doc;
  doc["angulo"] = angulo;  
  char jsonBuffer[512];

  serializeJson(doc, jsonBuffer); 

  client.publish(AWS_IOT_PUBLISH_TOPIC2, jsonBuffer);
  
}

void messageHandler(char* topic, byte* payload, unsigned int length)
{
  Serial.print("Incoming message from topic: ");
  Serial.println(topic);

  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);
  const char* message = doc["message"];
  Serial.println(message);
}


void setup() {
  Serial.begin(115200); 
  Serial.println("Hola");
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

  Serial.println("Enter e-KTP ID (format: XX XX XX XX):");
  timeClient.begin();
  timeClient.setTimeOffset(0);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim(); 
    client.loop();
    timeClient.update();
    unsigned long currentMillis = millis(); 

    if (isValidFormat(input)) {

      pin = input;

      if (input.equals("12 34 56 78")) { 
        accessGranted();
        ingreso = true;
        
      } else {
        accessDenied();
      }

      
      publishMessage();

    } else {
      Serial.println("Invalid format. Enter e-KTP ID (format: XX XX XX XX):");
    }

    ingreso = false;
   
    // Check if interval has passed
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis; // Save the last time the event occurred
        angulo = servo.read();
        publishMessage2();
        // Your timed event
        Serial.println("Timer triggered!");
    }

  
  }
 

}

bool isValidFormat(String input) {
  if (input.length() == 11 && input.charAt(2) == ' ' && input.charAt(5) == ' ' && input.charAt(8) == ' ') {
    for (int i = 0; i < input.length(); i++) {
      if (i != 2 && i != 5 && i != 8) {
        if (!isDigit(input.charAt(i))) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
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
