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

// Pines RFID
#define SS_PIN 5
#define RST_PIN 23
#define SCK_PIN 4       // Pin SCK (Clock)
#define MOSI_PIN 21     // Pin MOSI (Master Out Slave In)
#define MISO_PIN 19     // Pin MISO (Master In Slave Out)

#define BUZZER_PIN 14
#define GREEN_LED 26
#define RED_LED 25
#define RELAY_PIN 27
#define SERVO_PIN 13

Servo servo;
MFRC522 rfid(SS_PIN, RST_PIN); // Instancia de la clase MFRC522
MFRC522::MIFARE_Key key;
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

// Función para validar la tarjeta en un servidor (conectado a AWS IoT, por ejemplo)
int validateCard(String uuidStr) {
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  
  // Prepare JSON payload
  String payload = "{\"id\":\"" + uuidStr + "\"}";
  
  Serial.println("Validating card: " + uuidStr);
  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
    http.end();

    // Parse the outer JSON response (statusCode and body)
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error && doc.containsKey("body")) {
      String body = doc["body"].as<String>();
      StaticJsonDocument<200> bodyDoc;
      DeserializationError bodyError = deserializeJson(bodyDoc, body);

      if (!bodyError && bodyDoc.containsKey("card_id")) {
        int cardID = bodyDoc["card_id"].as<int>();
        return cardID; // Return the card ID from the response
      } else {
        Serial.println("Invalid body response format");
        return -1;
      }
    } else {
      Serial.println("Invalid outer response format");
      return -1;
    }
  } else {
    Serial.println("HTTP Request Failed");
    http.end();
    return -1;
  }
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
}

void connectAWS()
{

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
void setup() {
  Serial.begin(9600);
  Serial.println("Hola");
  WiFi.mode(WIFI_STA);
  WiFi.begin("POCO X3 NFC", "12345678");

  Serial.println("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Set up AWS IoT
  setupAWS();
  connectAWS();

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  servo.attach(SERVO_PIN);
  servo.write(0);

  // Inicia SPI con los pines correctos
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  rfid.PCD_Init();
  Serial.println("Esperando tarjeta...");
}

void loop() {
  client.loop();
  timeClient.update();

  // Verifica si hay una tarjeta presente y la lee
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.println("Tarjeta leída");
    
    String cardNumber = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      if (rfid.uid.uidByte[i] < 0x10) {
        cardNumber += "0";
      }
      cardNumber += String(rfid.uid.uidByte[i], HEX);
    }
    Serial.println("UID de la tarjeta: " + cardNumber);

    // Validar la tarjeta en el servidor
    int cardID = validateCard(cardNumber);
    if (cardID > -1) {
      accessGranted();
    } else {
      accessDenied();
    }

    // Publicar datos de la tarjeta en AWS IoT
    publishRFIDData(cardID, cardNumber, true, 1);

    // Pausa de 1 segundo para evitar lecturas repetidas
    delay(1000);
    rfid.PICC_HaltA();  // Detiene la lectura
  }
}

void accessGranted() {
  Serial.println("Access granted!");
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(RELAY_PIN, HIGH);

  servo.write(90);  // Mueve el servo
  delay(5000);  // Espera 5 segundos
  servo.write(0);  // Regresa el servo a su posición inicial

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RELAY_PIN, LOW);
}

void accessDenied() {
  Serial.println("Access denied!");
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(RED_LED, HIGH);
  delay(5000);  // Espera 5 segundos
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RED_LED, LOW);
}

void publishRFIDData(int cardID, String cardNumber, bool access, int puerta) {
  if (!client.connected()) {
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
