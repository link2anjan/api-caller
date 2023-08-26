# api-caller

The "API Caller" project is a web application that allows users to make multiple API calls using various HTTP methods such as GET, POST, PUT, DELETE, and PATCH. Users can specify the API URL, request headers, request body, and the number of times the API should be called. The responses are displayed in a scrollable result box, and users can choose to show or hide the response details. It's designed to provide a simple interface for testing and visualizing API calls.

![alt text](https://github.com/link2anjan/api-caller/blob/main/scr.png?raw=true)

### Build the Docker image:
```markdown
docker build -t a1anjanjana/api-caller .
```

### Pull image from docker hub
```markdown
docker pull a1anjanjana/api-caller:latest
```

### Docker run
```markdown
docker run -d -p 3000:3000 api-caller
```
