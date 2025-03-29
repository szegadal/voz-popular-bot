# Voz Popular Bot

> ⚠️ **ADVERTENCIA**: Este proyecto solo se activa para demostraciones (postulaciones de trabajo o pruebas de concepto). Si deseas probarlo, abre un issue en este repositorio o crea un pull request, y me pondré en contacto contigo para activarlo temporalmente.

Bot de Telegram para el programa radial "Voz Popular" de la radioemisora Panamericana en Bolivia.

## Prueba la herramienta

Prueba este chatbot escribiendo a [t.me/vozPopularBot](https://t.me/vozPopularBot) y manda un mensaje de audio detallando un nombre inventado, una edad inventada, y una queja inventada hacia un nivel de gobierno (nacional, municipal, etc.).

Puedes usar este texto como ejemplo:
> "Hola, mi nombre es Juan Pérez y tengo 25 años. Me quiero quejar porque el gobierno municipal no está arreglando las calles y hay muchos baches por toda la ciudad."

## Funcionamiento

Este bot de Telegram funciona de la siguiente manera:

1. Responde a los mensajes de texto enviados por los usuarios con instrucciones, solicitando que envíen un mensaje de audio.
2. Cuando el usuario envía un mensaje de audio:
   - Descarga el archivo de audio de Telegram
   - Transcodifica el audio utilizando FFmpeg
   - Transcribe el audio a texto usando OpenAI Whisper
   - Analiza el sentimiento y extrae información relevante del texto utilizando GPT-3.5 Turbo
   - Envía un resumen al usuario con los datos extraídos (nombre, sexo, edad, sentimiento, nivel de gobierno mencionado, y si el contenido es ofensivo o discriminatorio)
   - Almacena el archivo transcodificado en AWS S3

El bot está diseñado para recopilar opiniones de radioescuchas que quieran participar en el programa "Voz Popular", facilitando el análisis de los mensajes recibidos.

## Stack Tecnológico

- **Node.js**: Entorno de ejecución para el código
- **TypeScript**: Lenguaje de programación utilizado
- **AWS Lambda**: Para la ejecución serverless del código
- **AWS API Gateway**: Para exponer el endpoint que recibe las actualizaciones de Telegram
- **AWS S3**: Para almacenar los archivos de audio transcodificados
- **Telegram Bot API**: Para la integración con Telegram
- **OpenAI API**:
  - GPT-3.5 Turbo: Para el análisis de sentimiento y extracción de información
  - Whisper: Para la transcripción de audio a texto
- **FFmpeg**: Para la transcodificación de archivos de audio

## Limitaciones y Áreas de Mejora

- **Manejo de errores inadecuado**: El proyecto carece de un manejo de errores robusto, lo que puede llevar a comportamientos inesperados.
- **Tecnología desactualizada**: Utiliza GPT-3.5 Turbo que ya ha sido superado por versiones más recientes.
- **Proyecto inicial**: Este fue uno de mis primeros proyectos desarrollado en mayo de 2023, por lo que presenta algunas deficiencias estructurales.
- **Sin mantenimiento activo**: No he tenido tiempo de actualizar o mejorar el código desde su implementación inicial.

## Instalación y Configuración

Para configurar este proyecto localmente, necesitarás:

1. Crear un bot de Telegram y obtener su token
2. Configurar una cuenta de AWS y los servicios correspondientes
3. Obtener una API key de OpenAI
4. Configurar las variables de entorno necesarias
5. Desplegar el código en AWS Lambda

## Contribuciones

Este proyecto es demostrativo y no recibe contribuciones.