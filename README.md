# zorvyn_

A robust Node.js backend application built with **TypeScript**, leveraging **Mongoose** for data modeling and featuring advanced **MongoDB Client-Side Field Level Encryption (CSFLE)** capabilities.



## ✨ Features
- **Type-Safe Development**: Fully implemented in TypeScript for enhanced developer experience and code reliability.
- **Object Modeling**: Utilizes Mongoose for structured data storage and schema validation.
- **Data Security**: Integrated support for MongoDB Client-Side Field Level Encryption to protect sensitive data at rest and in transit.
- **Optimized Workflow**: Automated restart and hot-reloading using `nodemon` for efficient development.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Encryption**: `mongodb-client-encryption`

## 📋 Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: v6.0+ (Atlas or Local)
- **Shared Library**: Ensure `libmongocrypt` is installed on your system to support encryption features.

## 🚀 Installation

1. Clone the repository and navigate to the project directory.
2. Install the necessary dependencies:

```bash
npm install
```

## 🔑 Environment Variables
Create a `.env` file in the root directory to configure your environment:

```env
MONGODB_URI=mongodb://localhost:27017/zorvyn
KEY_VAULT_NAMESPACE=encryption.__keyVault
# If using a local master key for encryption (96 bytes)
LOCAL_MASTER_KEY=your_base64_encoded_96_byte_key
```

## 💻 Development

Available scripts in the project:

- `npm run dev`: Starts the application in development mode with `nodemon`.
- `npm run build`: Compiles the TypeScript source code into JavaScript.
- `npm start`: Runs the compiled application from the `dist` directory.

## 🔒 Security & Encryption
The project implements explicit encryption using the `ClientEncryption` interface. This allows for:
- **Data Key Management**: Creating and rotating data keys within a dedicated key vault.
- **Field Level Security**: Encrypting specific PII (Personally Identifiable Information) before it is sent to the database.
- **Range Queries**: Support for Queryable Encryption where applicable.
