# json-parser

A json parser built using Node.js &amp; TypeScript.

Welcome to the **json-parser** repository! This project provides a versatile JSON parser capable of handling and returning data in either JSON or Abstract Syntax Tree (AST) formats. Mainly crafted for learning purposes, the project offers a comprehensive overview of JSON parsing and data processing, making it an excellent resource for developers looking to understand JSON parsing in-depth.

---

## Introduction

JSON parsers are a fundamental component in modern development environments. They help manage and interpret JSON data, which is prevalent in various applications and services. For example, if you paste JSON into an editor like VS Code, it automatically parses and highlights errors, showcasing the importance of robust parsing mechanisms.

The `json-parser` project enables you to parse JSON data and retrieve it in different formats, offering flexibility for various use cases. It supports multipart form-data requests and provides detailed error handling to ensure accurate data processing.

---

## Features

- **Parse JSON Data**: Convert raw JSON input into a structured JSON format.
- **Generate AST**: Transform JSON into an abstract syntax tree for detailed analysis and manipulation.
- **Flexible Input Handling**: Accept multipart form-data for both JSON and AST formats.
- **Detailed Error Reporting**: Clear and informative messages for invalid inputs and formats.

---

## Installation

To get started with `json-parser`, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/devaaravmishra/json-parser.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
    cd json-parser
   ```

3. **Install the Dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

   or

   ```bash
   pnpm install
   ```

4. **Run the Project:**

   ```bash
   npm start
   ```

5. **Access the Application:**
   Open your browser and visit `http://localhost:3000` or your specified port.

---

## Usage

The `json-parser` API provides endpoints to parse JSON data and return results in either JSON or AST format. Here’s how to use the API:

1. **Parse JSON Data:**

   Send a POST request to `/parse/json` with the JSON data in the request body. The server will return the parsed JSON data.

   ```http
   POST /parse query: format=json
   Content-Type: multipart/form-data; boundary=boundary

    --boundary
    Content-Disposition: form-data; name="json"

    {
      "name": "John Doe",
      "age": 30,
      "city": "New York"
    }
    --boundary
    Content-Disposition: form-data; name="format"

    json
    --boundary--
   ```

### Response:

```json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
```

2. **Generate AST:**

   Send a POST request to `/parse` with the JSON data in the request body. The server will return the abstract syntax tree (AST) of the JSON data.

   ```http
   POST /parse query: format=ast
   Content-Type: multipart/form-data; boundary=boundary

   --boundary
   Content-Disposition: form-data; name="json"

    {
      "name": "Sample Project",
      "version": 1,
      "description": "A detailed description of the sample project."
    }
    --boundary
    Content-Disposition: form-data; name="format"

    ast
    --boundary--
   ```

## Response

```json
{
  "type": "Object",
  "value": {
    "name": {
      "type": "String",
      "value": "Sample Project"
    },
    "version": {
      "type": "Number",
      "value": 1
    },
    "description": {
      "type": "String",
      "value": "A detailed description of the sample project."
    }
    // Additional fields...
  }
}
```

3. **Error Handling: Invalid Format**

   #### Request:

   ```http
   POST /parse query: format=xml
   Content-Type: multipart/form-data; boundary=boundary

    --boundary
    Content-Disposition: form-data; name="json"

    {
      "name": "Invalid Format Test"
    }
    --boundary
    Content-Disposition: form-data; name="format"

    xml
    --boundary--
   ```

### Response:

```json
{
  "message": "Invalid format query parameter (must be json or ast)"
}
```

---

## Key Concepts

### Tokenizing

Tokenizing is the initial step in parsing and is essential for any interpreter or compiler. It involves breaking down the input into smaller, manageable parts called tokens. This process helps the parser understand and process the data more effectively. Tokenizing also plays a crucial role in error detection by categorizing tokens and identifying syntax errors.

### Parsing

Parsing is the process of analyzing the tokenized input to determine its structure and meaning. It involves creating a hierarchical representation of the data, such as an abstract syntax tree (AST). Parsing is crucial for interpreting the input accurately and performing operations based on the data's structure. It helps identify relationships between different elements and ensures the data is processed correctly.

## Contributing

I welcome contributions from the community to enhance the `json-parser` project further. If you have any suggestions, bug reports, or feature requests, please feel free to raise an issue or submit a pull request. Your contributions are valuable and help improve the project for everyone.

## License

The `json-parser` project is open-source and available under the [MIT License](LICENSE). You are free to use, modify, and distribute the code as per the terms of the license.

## Contact

If you have any questions or feedback, feel free to reach out: [me at](mailto:aaravmishra619@gmail.com)

---
