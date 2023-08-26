document.addEventListener("DOMContentLoaded", () => {
  // footer content
  const currentYearSpan = document.getElementById("currentYear");
  currentYearSpan.textContent = new Date().getFullYear();
  //-----
  const callApiButton = document.getElementById("callApiButton");
  const requestCountInput = document.getElementById("requestCount");
  const resultDiv = document.getElementById("result");
  const addHeaderButton = document.getElementById("addHeader");
  const apiUrlInput = document.getElementById("apiUrl");
  const requestMethodSelect = document.getElementById("requestMethod");
  const showResponseSelect = document.getElementById("showResponse");
  const requestBodyInput = document.getElementById("requestBody");
  const requestHeaders = document.getElementById("requestHeaders");
  const headerGroups = [];

  addHeaderButton.addEventListener("click", () => {
    const headerInputGroup = document.createElement("div");
    headerInputGroup.className = "header-input-group";
    headerInputGroup.innerHTML = `
      <input type="text" class="header-input" placeholder="Header Name">
      <input type="text" class="header-input" placeholder="Header Value">
      <button class="remove-header">-</button>
    `;
    requestHeaders.appendChild(headerInputGroup);
  
    headerGroups.push(headerInputGroup); // Store the added group
  
    const removeHeaderButton = headerInputGroup.querySelector(".remove-header");
    removeHeaderButton.addEventListener("click", () => {
      headerInputGroup.remove();
      const index = headerGroups.indexOf(headerInputGroup);
      if (index !== -1) {
        headerGroups.splice(index, 1); // Remove the group from the array
      }
    });
  });
  
  callApiButton.addEventListener("click", async () => {
    const requestCount = parseInt(requestCountInput.value, 10);

    if (isNaN(requestCount) || requestCount <= 0) {
      resultDiv.textContent = "Please enter a valid positive number.";
      return;
    }

    resultDiv.textContent = "Calling the APIs...";
    resultDiv.innerHTML = "Waiting for responses...";

    try {
      const responses = [];
      const headers = getHeaders();
      const showResult = showResponseSelect.value === "YES";

      for (let i = 0; i < requestCount; i++) {
        const response = fetch("/api/call-api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiUrl: apiUrlInput.value,
            method: requestMethodSelect.value,
            headers: headers,
            body: requestBodyInput.value,
            showResult: showResult,
          }),
        });
        responses.push(response);
      }

      if(showResult){
        for (let i = 0; i < responses.length; i++) {
          const response = await responses[i];
          const responseData = await response.json();
          if (i === 0) resultDiv.innerHTML = "";
  
          const responseElement = document.createElement("p");
          responseElement.textContent = `Response ${i + 1}:\n${JSON.stringify(
            responseData,
            null,
            2
          )}`;
  
          resultDiv.appendChild(responseElement);
        }
      }else{
        resultDiv.innerHTML = "";
      } 
    } catch (error) {
      resultDiv.textContent = "An error occurred while calling the APIs.";
    }
  });

  function getHeaders() {
    const headers = {};
    headerGroups.forEach(group => {
      const headerName = group.querySelector(".header-input:first-child").value;
      const headerValue = group.querySelector(".header-input:nth-child(2)").value;
      if (headerName && headerValue) {
        headers[headerName] = headerValue;
      }
    });
    return headers;
  }
  
});
