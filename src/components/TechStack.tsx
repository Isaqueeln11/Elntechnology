@@ .. @@
   const techCategories = [
     {
       category: 'Hardware',
       technologies: [
         { name: 'Arduino', icon: Cpu },
         { name: 'Raspberry Pi', icon: Cpu },
         { name: 'ESP32/ESP8266', icon: Wifi },
         { name: 'STM32', icon: Cpu },
         { name: 'Sensores IoT', icon: Zap },
         { name: 'Módulos RF', icon: Radio }
       ]
     },
     {
       category: 'Software',
       technologies: [
         { name: 'C/C++', icon: Code },
         { name: 'Python', icon: Code },
         { name: 'JavaScript', icon: Code },
         { name: 'MicroPython', icon: Code },
         { name: 'Arduino IDE', icon: Wrench },
         { name: 'PlatformIO', icon: Wrench }
       ]
     },
     {
       category: 'PCB Design',
       technologies: [
         { name: 'Altium Designer', icon: Layers },
         { name: 'KiCad', icon: Layers },
         { name: 'Eagle CAD', icon: Layers },
         { name: 'Proteus', icon: Layers },
         { name: 'SPICE Simulation', icon: Activity },
         { name: 'Thermal Analysis', icon: Thermometer }
       ]
     },
-    {
-      category: 'Cloud & DevOps',
-      technologies: [
-        { name: 'AWS IoT', icon: Cloud },
-        { name: 'Azure IoT', icon: Cloud },
-        { name: 'Docker', icon: Package },
-        { name: 'Kubernetes', icon: Package },
-        { name: 'CI/CD', icon: GitBranch },
-        { name: 'Terraform', icon: Settings }
-      ]
-    },
-    {
-      category: 'Mobile',
-      technologies: [
-        { name: 'React Native', icon: Smartphone },
-        { name: 'Flutter', icon: Smartphone },
-        { name: 'Ionic', icon: Smartphone },
-        { name: 'Xamarin', icon: Smartphone },
-        { name: 'PWA', icon: Globe },
-        { name: 'Cordova', icon: Smartphone }
-      ]
-    },
-    {
-      category: 'Database',
-      technologies: [
-        { name: 'MongoDB', icon: Database },
-        { name: 'PostgreSQL', icon: Database },
-        { name: 'MySQL', icon: Database },
-        { name: 'Redis', icon: Database },
-        { name: 'InfluxDB', icon: Database },
-        { name: 'SQLite', icon: Database }
-      ]
-    }
+    {
+      category: 'Comunicação',
+      technologies: [
+        { name: 'LoRa/LoRaWAN', icon: Radio },
+        { name: 'WiFi', icon: Wifi },
+        { name: 'Bluetooth', icon: Bluetooth },
+        { name: 'Zigbee', icon: Radio },
+        { name: 'MQTT', icon: MessageSquare },
+        { name: 'Modbus', icon: Cable }
+      ]
+    },
+    {
+      category: 'Ferramentas',
+      technologies: [
+        { name: 'Oscilloscópio', icon: Activity },
+        { name: 'Multímetro', icon: Zap },
+        { name: 'Analisador Lógico', icon: BarChart },
+        { name: 'Soldagem SMD', icon: Wrench },
+        { name: 'Impressora 3D', icon: Box },
+        { name: 'Bancada de Testes', icon: Settings }
+      ]
+    }
   ];