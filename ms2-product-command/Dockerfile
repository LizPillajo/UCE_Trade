FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

# Copy the executable file compiled by Gradle
COPY build/libs/*.jar app.jar

# Command to run the microservice
ENTRYPOINT ["java","-jar","/app.jar"]