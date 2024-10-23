# Campaign and Lead Management API

## Overview

This API allows you to manage campaigns and leads by storing data from JSON files into a MongoDB database. It also generates PDF reports and sends email notifications based on specific conditions, such as a high cost per lead for campaigns.

## Features:

- **Lead Management**: Fetch and store lead data from JSON files into MongoDB.
- **Campaign Management**: Fetch and store campaign data from JSON files into MongoDB.
- **PDF Report Generation**: Generate PDF reports for campaigns and leads.
- **Email Notifications**: Receive email alerts for specific conditions (e.g., high cost per lead).

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or cloud)
- Email service credentials (for sending notifications)

### setup

#### Getting Started

##### Clone the repository:

```bash
git clone https://github.com/kaziabulhasib/ezy-metrics-server
```

##### Navigate to the project directory:

```bash
cd ezy-metrics-server
```

##### Install dependencies:

```bash

npm install

```

##### Create a .env file in the root directory and add the variables

```bash

DB_STRING=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_password

```

##### Start the server:

```bash

npm run dev

```

## API Usage

### Endpoints

- **GET /api/leads**: Fetch all leads from the database.
- **POST /api/leads/store**: Store leads in MongoDB from the `leads.json` file.

- **GET /api/campaigns**: Fetch all campaigns from the database.
- **POST /api/campaigns/store**: Store campaigns in MongoDB from the `campaigns.json` file.

- **GET /api/reports/pdf**: Generate and download a PDF report of campaigns and leads.

### Email Notifications

- Receive alerts for specific conditions such as when storing leads, high cost per lead.
