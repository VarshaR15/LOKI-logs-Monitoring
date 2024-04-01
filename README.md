<h1> Loki overview: </h1>

Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. Loki differs from Prometheus by focusing on logs instead of metrics, and collecting logs via push, instead of pull.
Loki is designed to be very cost effective and highly scalable. Unlike other logging systems, Loki does not index the contents of the logs, but only indexes metadata about your logs as a set of labels for each log stream.

<h2> Loki features: </h2>
1. Scalability - Loki is designed for scalability, and can scale from as small as running on a Raspberry Pi to ingesting petabytes a day. In its most common deployment, “simple scalable mode”, Loki decouples requests into separate read and write paths, so that you can independently scale them, which leads to flexible large-scale installations that can quickly adapt to meet your workload at any given time.</l1>
2. Multi-tenancy - Loki allows multiple tenants to share a single Loki instance. With multi-tenancy, the data and requests of each tenant is completely isolated from the others. Multi-tenancy is configured by assigning a tenant ID 
3. Grafana integration - Loki integrates with Grafana, Mimir, and Tempo, providing a complete observability stack, and seamless correlation between logs, metrics and traces.

<h3>A Loki-based logging stack consists of 3 components:</h3>

- promtail is the agent, responsible for gathering logs and sending them to Loki.
- loki is the main server, responsible for storing logs and processing queries.
- Grafana for querying and displaying the logs.

Installation using Docker Compose
1. Prerequisites:
Before proceeding with the installation, ensure that Docker and Docker Compose are installed on your system.

2. Setting Up the Nodejs Microservice:
NGNIX-MICROSERVICE is a simple microservices architecture using Nginx as a reverse proxy. Within this architecture,created three separate Node.js services: OMS (Order Management System), eCommerce, and Auth (Authentication). Each of these services will be containerized and run using Docker.
Go to the project directory

```
  cd Ngnix-Microservices-example
```

Start the server

```
  docker compose up
```

3. Build docker-compose file:

which contains the microservice's server images such as Ngnix, Auth (Authentication), ecommerce, OMS (Order Management System). it also contains 

GRAFANA -
image: grafana/grafana 
Description: Grafana stands as a premier open-source platform designed for observability, offering powerful visualization and analytics capabilities across diverse data sources, including logs, metrics, and traces.

LOKI - 
image: grafana/loki:latest
Description: Loki represents a cutting-edge log aggregation and storage system engineered for modern observability needs. With a focus on efficiency and scalability, Loki empowers organizations to handle and analyze vast amounts of log data with ease.

PROMTAIL - 
image: grafana/promtail:latest
Description: Promtail acts as a vital component in the logging pipeline, enabling the collection of logs from various sources, including files, applications, and services. It parses log entries using regular expressions, facilitating structured log storage in Loki.
Key Features: Promtail offers powerful log scraping capabilities, automatic log rotation handling, and support for multi-line log entries. It ensures reliable and scalable log collection in distributed environments, enhancing observability and troubleshooting capabilities.
 

4. setup and run Loki with Grafana Dashboard:-

# Logging Configuration with Loki Driver:

To enable centralized logging with Loki for your server containers, you must add the following logging configuration to each server service definition in your Docker Compose file:

```bash
  logging:
  driver: loki
  options:
    loki-url: "http://192.168.0.104:3100/loki/api/v1/push"
```

Logging Driver: The loki logging driver specifies that logs generated by containers will be sent to Loki for storage and analysis.

Loki URL: The loki-url option specifies the URL where Loki's API endpoint is located. In this configuration, logs will be pushed to 
http://(YOUR IP addrs):3100/loki/api/v1/push, indicating the address of the Loki server where logs will be sent.

Then add networks as loki in docker compose file

```bash 
networks:
  loki:
    driver: bridge
```
then perform 

```bash
  docker compose up
```
which starts the microservice

Usage:
Use this logging configuration to stream logs generated by your server's containers to Loki. By sending logs to Loki, you can centralize log storage and gain access to powerful querying and visualization capabilities offered by Loki and tools like Grafana.

# Adding a Datasource in Grafana
To visualize logs stored in Loki within Grafana, you need to add Loki as a datasource in Grafana. Follow the steps below to configure Loki as a datasource:

Access Grafana:
Open your web browser and navigate to the Grafana web interface running on port 3000. Log in with your credentials if required.

Navigate to Data Sources:
In the Grafana UI, click on the gear icon (⚙️) in the sidebar to open the configuration menu. Then, click on "Data Sources" under the "Configuration" section.

Add Datasource:
Click on the "Add data source" button to add a new datasource.

Select Loki:
In the list of available datasources, locate and click on "Loki".

Configure Datasource:
Configure the following settings for the Loki datasource:

Name: Provide a name for the datasource (e.g., "Loki").
URL: Enter the URL of the Loki API endpoint.(your IPaddrs: 3100)
Save and Test:
After configuring the datasource, click on the "Save & Test" button to save the configuration and test the connection to Loki.

Verify Connection:
Once saved, Grafana will test the connection to the Loki datasource. If the connection is successful, you will see a confirmation message indicating that the datasource is working.

Start Visualizing Logs:
With Loki configured as a datasource in Grafana, you can now start creating dashboards and visualizations to analyze logs from your applications.

5. Access both Docker containers logs and external log file:-

# Accessing Docker containers logs-

After adding Loki data source using LogQL we can view the docker logs such as using below given query

```bash
{container_name="ms_nginx"} |= ``
```
# Accessing external log file-

Logging to External Files with logToFile Module
The logToFile module provides a convenient way to log messages to external files within an application. By utilizing this module, developers can seamlessly write log messages to designated files, facilitating centralized logging across multiple components or servers.

Example Usage:
```bash
import logToFile from 'logToFile';

// Example usage in an Express middleware
app.use((req, res, next) => {
  // Log request details to external file
  logToFile(`${req.method} ${req.url}`, 'requests.log');
  next();
});

// Logging responses to external files
res.on('finish', () => {
  logToFile(`Response status: ${res.statusCode}`, 'responses.log');
});
```

The logToFile module facilitates logging messages to external files within microservice architecture, generating separate log files for individual microservices such as auth_logs.txt, ecommerce_logs.txt, and oms_logs.txt.


# Volumes Configuration-
The Docker Compose file for your application includes volume configurations to enable data sharing between the host machine and the Docker containers. Here's a breakdown of the volumes specified in the configuration:

First You need to create three volumes as auth_logs, ecoms_logs, oms_logs for three servers

Volume Mount: 'auth_logs:/usr/src/app'
This volume mount attaches the Docker named volume auth_logs to the /usr/src/app directory inside the Docker container. The purpose of this volume is to store application logs externally, providing persistent storage that persists across container instances.

Volume Mount: 'ecom_logs:/usr/src/app'
This volume mount attaches the Docker named volume ecom_logs to the /usr/src/app directory inside the Docker container. The purpose of this volume is to store logs related to e-commerce activities, providing persistent storage that persists across container instances

Volume Mount: 'oms_logs:/usr/src/app'
This volume mount attaches the Docker named volume oms_logs to the /usr/src/app directory inside the Docker container. The purpose of this volume is to store logs related to order management systems, providing persistent storage that persists across container instances.

Volume mounting in promtail is give as :

 ```bash
 volumes:
      - "/var/log:/var/log"
      - "auth_logs:/auth_logs"
      - "ecoms_logs:/ecoms_logs"
      - "oms_logs:/oms_logs"
      - "./positions.yaml:/tmp/positions_new.yaml"
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./promtail.yaml:/etc/promtail.yaml"
 ```

# Configuring promtail.yaml :

The Promtail configuration file defines settings for Promtail, a log shipping agent used in conjunction with Grafana Loki for collecting, processing, and forwarding logs. This document provides an overview of the key components and functionalities defined within the configuration.


create a file as promatil.yaml and add the following code 

```bash
positions:
  filename: ./positions.yaml
clients:
  - url: http://192.168.0.104:3100/loki/api/v1/push
scrape_configs:
  - job_name: auth_logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: auth_logs
          __path__: /auth_logs/auth/auth_logs.txt
    pipeline_stages:
      - regex:
          expression: '^(?P<timestamp>\S+)\s+->\s+(?P<message>.*)$'
  - job_name: ecoms_logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: ecoms_logs
          __path__: /ecoms_logs/ecommerce/ecommerce_logs.txt
    pipeline_stages:
      - regex:
          expression: '^(?P<timestamp>\S+)\s+->\s+(?P<message>.*)$'

  - job_name: oms_logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: oms_logs
          __path__: /oms_logs/oms/oms_logs.txt
    pipeline_stages:
      - regex:
          expression: '^(?P<timestamp>\S+)\s+->\s+(?P<message>.*)$'
```

This configuration enables Promtail to effectively collect logs from external sources, such as authentication, ecommerce, and order management services. By defining scrape configurations for each external log source and utilizing regex stages for parsing, Promtail facilitates efficient log collection and analysis within the Loki ecosystem.

The Promtail positions configuration file, typically named positions.yaml, is utilized by Promtail to keep track of the read positions within log files.
which is given as

```bash
positions:
  /auth_logs/auth/auth_logs.txt: "0"
  /ecoms_logs/ecommerce/ecommerce_logs.txt: "0"
  /oms_logs/oms/oms_logs.txt: "0"

```


Hence, external logs can be viewed using LogQL:
```bash
{job="auth_logs"} |= ``
```
```bash
{job="ecoms_logs"} |= ``
```
```bash
{job="oms_logs"} |= ``
```
6. visualization for count of status code

# Middleware for Logging Status Code and Response Time

This middleware logs the status code and response time of HTTP requests. It records the start time of request processing and captures the response details once the response is sent.

Configure the below middleware in your server to get the status code

```bash
app.use((req, res, next) => {
  const startTime = Date.now(); // Start time when request is received

  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime; // Elapsed time between request and response
    const statusCode = res.statusCode; // Status code of the response
    const logMessage = `${req.method} ${req.url} responded with status ${statusCode} in ${elapsedTime} ms`;
    logToFile(logMessage,"external_file.txt");
  });

  next();
});
```

Then in Grafana for Loki as the data source perform LogQL query given as

```bash
count_over_time({job="auth_logs"} |= `status 502` [24h])
```

The query aims to identify and quantify occurrences of HTTP 502 errors within the authentication logs ("auth_logs") job over the past 24 hours.
By monitoring the frequency of these errors, system administrators can assess the stability and performance of the authentication service and take appropriate actions to address any underlying issues.

for Graph Visualization of logs use rate() which can be performed as 

```bash 
rate({job="auth_logs"} |= `status 200` [1m])
```

The provided query calculates the rate of occurrences where the status code equals 200 within the "auth_logs" job over a 1-minute window. This metric offers insights into the frequency of successful responses generated by the authentication service within short intervals, aiding in real-time monitoring and performance assessment.#   L O K I - l o g s - M o n i t o r i n g 
 
 
