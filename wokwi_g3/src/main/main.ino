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
#define SS_PIN 5      // Primer lector RFID
#define RST_PIN 23    

#define SS_PIN2 32    // Segundo lector RFID
#define RST_PIN2 33    

#define SCK_PIN 4     // SPI Clock
#define MOSI_PIN 21   // SPI Master Out Slave In
#define MISO_PIN 19   // SPI Master In Slave Out

// Pines de salida
#define BUZZER_PIN 14
#define GREEN_LED 26
#define RED_LED 25
#define RELAY_PIN 27
#define SERVO_PIN 13   // Primer servo
#define SERVO_PIN2 2  // Segundo servo

// Instancias de objetos
Servo servo1, servo2;
MFRC522 rfid1(SS_PIN, RST_PIN);   // Primer lector RFID
MFRC522 rfid2(SS_PIN2, RST_PIN2); // Segundo lector RFID

// Configuración de AWS IoT
#define AWS_IOT_PUBLISH_TOPIC "molinete/pub"
#define AWS_IOT_PUBLISH_TOPIC3 "molinete/rfid/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "molinete/sub"

WiFiClientSecure net;
PubSubClient client(net);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "id.pool.ntp.org");

// Prototipos de funciones
void checkWiFiConnection();
void accessGranted(int puerta);
void accessDenied(int puerta);
void publishRFIDData(int cardID, String cardNumber, bool access, int puerta);
void handleRFID(MFRC522 &rfid, int puerta);

// Función para validar la tarjeta en un servidor (conectado a AWS IoT, por ejemplo)
int validateCard(String uuidStr) {
  HTTPClient http;
  http.setTimeout(2000);
  http.begin(VALIDATION_API);
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
  }
    http.end();
    return -1;
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
  Serial.println("Iniciando sistema...");

  // Conectar WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin("POCO X3 NFC", "12345678");

  Serial.println("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  setupAWS();
  connectAWS();

  // Configuración de pines
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  // Inicializar servos
  servo1.attach(SERVO_PIN);
  servo2.attach(SERVO_PIN2);
  servo1.write(0);
  servo2.write(0);

  // Iniciar SPI y los lectores RFID
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  rfid1.PCD_Init();
  rfid2.PCD_Init();

  Serial.println("Esperando tarjetas...");
}

void loop() {
  checkWiFiConnection();
  client.loop();
  timeClient.update();

  // Procesar el primer lector RFID
  if (rfid1.PICC_IsNewCardPresent() && rfid1.PICC_ReadCardSerial()) {
    handleRFID(rfid1, 1);
  }

  // Procesar el segundo lector RFID
  if (rfid2.PICC_IsNewCardPresent() && rfid2.PICC_ReadCardSerial()) {
    handleRFID(rfid2, 2);
  }
}

void handleRFID(MFRC522 &rfid, int puerta) {
  Serial.print("Tarjeta detectada en puerta ");
  Serial.println(puerta);

  String cardNumber = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) {
      cardNumber += "0";
    }
    cardNumber += String(rfid.uid.uidByte[i], HEX);
  }
  Serial.println("UID de la tarjeta: " + cardNumber);

  int cardID = validateCard(cardNumber);
  if (cardID > -1) {
    accessGranted(puerta);
  } else {
    accessDenied(puerta);
  }

  publishRFIDData(cardID, cardNumber, (cardID > -1), puerta);
  delay(1000);
  rfid.PICC_HaltA();
}

void accessGranted(int puerta) {
  Serial.print("✅ Acceso concedido en puerta ");
  Serial.println(puerta);
  
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(RELAY_PIN, HIGH);

  if (puerta == 1) {
    servo1.write(90);
  } else {
    servo2.write(90);
  }
  
  delay(2500);
  
  if (puerta == 1) {
    servo1.write(0);
  } else {
    servo2.write(0);
  }

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RELAY_PIN, LOW);
}

void accessDenied(int puerta) {
  Serial.print("❌ Acceso denegado en puerta ");
  Serial.println(puerta);
  
  digitalWrite(BUZZER_PIN, HIGH);
  digitalWrite(RED_LED, HIGH);
  delay(2500);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RED_LED, LOW);
}

void publishRFIDData(int cardID, String cardNumber, bool access, int puerta) {
  if (!client.connected()) {
    connectAWS();
  }

  Serial.println("📡 Publicando datos de RFID a AWS IoT");
  StaticJsonDocument<200> doc;
  doc["fecha"] = timeClient.getEpochTime() + (-5 * 3600);
  doc["acceso"] = access;
  doc["id_tarjeta"] = cardID;
  doc["numero_tarjeta"] = cardNumber;
  doc["dispositivo"] = "rfid" + String(puerta);
  doc["detectado"] = true;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  client.publish(AWS_IOT_PUBLISH_TOPIC3, jsonBuffer);
  Serial.println("📤 Datos publicados");
}

void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠ WiFi desconectado. Intentando reconectar...");
    
    WiFi.disconnect();
    WiFi.begin("POCO X3 NFC", "12345678");

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 10) { 
      delay(1000);
      Serial.print(".");
      attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ WiFi reconectado.");
    } else {
      Serial.println("\n⚠ No se pudo reconectar a WiFi.");
    }
  }
}
