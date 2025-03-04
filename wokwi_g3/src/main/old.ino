#include <Arduino.h>
#include <ESP32Servo.h>
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <NTPClient.h>
#include <HTTPClient.h>
#include <MFRC522.h>
#include <SPI.h>

// RFID 1
#define RFID1_SS_PIN 5
#define RFID1_RST_PIN 0

// RFID2
#define RFID2_SS_PIN 15
#define RFID2_RST_PIN 2

#define BUZZER_PIN 14
#define GREEN_LED 26
#define RED_LED 25
#define RELAY_PIN 27
#define SERVO_PIN 13

Servo servo;
MFRC522 rfid1(RFID1_SS_PIN, RFID1_RST_PIN);
MFRC522 rfid2(RFID2_SS_PIN, RFID2_RST_PIN);
MFRC522::MIFARE_Key key;
// Array para guardar el uid de la tarjeta
byte nuidPICC[4];

#define AWS_IOT_PUBLISH_TOPIC "molinete/pub"
#define AWS_IOT_PUBLISH_TOPIC2 "molinete/servo/pub"
#define AWS_IOT_PUBLISH_TOPIC3 "molinete/rfid/pub"
#define AWS_IOT_PUBLISH_TOPIC4 "molinete/infrarojo/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "molinete/sub"

WiFiClientSecure net;
PubSubClient client(net);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "id.pool.ntp.org");

void setup()
{
  Serial.begin(115200);
  connectWifi();
  setupAWS();
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
  // Inicializa el lector RFID
  SPI.begin();
  rfid1.PCD_Init();
  rfid2.PCD_Init();
  // Asigna la variable de la llave con un valor por defecto
  for (byte i = 0; i < 6; i++)
  {
    key.keyByte[i] = 0xFF;
  }

  timeClient.begin();
  timeClient.setTimeOffset(0);
  Serial.println("Setup finalizado");
  Serial.println("");
}

void loop()
{
  client.loop();
  timeClient.update();
  processRFID(rfid1, 1);
  
  processRFID(rfid2, 2);

  
}

int validateCard(String uuidStr)
{
  HTTPClient http;
  http.begin(VALIDATION_API);
  http.addHeader("Content-Type", "application/json");

  

  // Prepare JSON payload
  String payload = "{\"id\":\"" + uuidStr + "\"}";

  Serial.println("Validating card: " + uuidStr);
  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println("Response: " + response);
    http.end();

    // Parse the outer JSON response (statusCode and body)
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error && doc.containsKey("body"))
    {
      // Extract the 'body' JSON string
      String body = doc["body"].as<String>();

      // Parse the 'body' as a separate JSON object
      StaticJsonDocument<200> bodyDoc;
      DeserializationError bodyError = deserializeJson(bodyDoc, body);

      if (!bodyError && bodyDoc.containsKey("card_id"))
      {
        // Ensure the card_id is returned as an integer
        int cardID = bodyDoc["card_id"].as<int>();
        return cardID; // Return the card ID from the response
      }
      else
      {
        Serial.println("Invalid body response format");
        return -1; // Return -1 if card_id is not found in body
      }
    }
    else
    {
      Serial.println("Invalid outer response format");
      return -1; // Return -1 if 'body' is not found
    }
  }
  else
  {
    Serial.println("HTTP Request Failed");
    http.end();
    return -1; // Return -1 if HTTP request failed
  }
}

void connectWifi(){
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando a Wi-Fi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
}

void setupAWS()
{
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);

  // Create a message handler
  // client.setCallback(messageHandler);
  Serial.println("Conexion AWS IOT configurada");
}

void connectAWS()
{
  Serial.print("Conectando a AWS IoT");
  while (!client.connected())
  {
    Serial.print(".");
    if (client.connect(THINGNAME))
    {
      Serial.println("");
      Serial.println("Connectado a AWS IoT");
      client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
    }
    else
    {
      Serial.println("Error al conectar a AWS IoT");
      delay(1000);
    }
  }
}

void publishRFIDData(int cardID, String cardNumber, bool access, int puerta)
{
  if (!client.connected()){
    Serial.println("Se perdio la conexion con AWS IoT, reconectando...");
    connectAWS();
  }
  Serial.println("Publicando datos de RFID a AWS IoT");
  StaticJsonDocument<200> doc;
  doc["fecha"] = timeClient.getEpochTime() + (-5 * 3600);
  doc["acceso"] = access;
  doc["id_tarjeta"] = cardID;
  doc["numero_tarjeta"] = cardNumber;
  doc["dispositivo"] = "rfid" + String(puerta);
  doc["detectado"] = true;
  char jsonBuffer[512];

  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC3, jsonBuffer);
  Serial.println("Datos publicados");
}



void accessGranted()
{
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

void accessDenied()
{
  Serial.println("Access denied!");
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(RED_LED, HIGH);
  delay(5000);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RED_LED, LOW);
}


// Función que procesa la lectura de una tarjeta RFID en un lector específico
void processRFID(MFRC522 &rfidModule, int door) {
  // Verifica si hay una tarjeta presente y la lee
  if (!rfidModule.PICC_IsNewCardPresent() || !rfidModule.PICC_ReadCardSerial())
  {
    return;
  }
 Serial.println("Acerque la tarjeta al lector");
  String cardNumber = "";
  //cardNumber = Serial.readStringUntil('\n');
  for (byte i = 0; i < rfidModule.uid.size; i++)
  {

    if (rfidModule.uid.uidByte[i] < 0x10)
    {
      cardNumber += "0";
    }else{
      cardNumber += " ";
    }
    cardNumber += String(rfidModule.uid.uidByte[i] , HEX);
  }
  cardNumber.trim();
  Serial.println("Card number: " + cardNumber);
 
  int cardID = validateCard(cardNumber);
  if (cardID > -1)
  {
    accessGranted();
    publishRFIDData(cardID, cardNumber,true, 1);
  }
  else
  {
    accessDenied();
    publishRFIDData(cardID, cardNumber,false, 1);
  }
  
  rfidModule.PICC_HaltA();
}
