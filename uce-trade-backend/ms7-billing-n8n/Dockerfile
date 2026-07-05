FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp

WORKDIR /app

# Copia el archivo compilado desde Gradle
COPY build/libs/*.jar app.jar

EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"]