# Northcoders News API

## Project Setup

This project is a backend service for a news API, mimicking the backend of reddit. 


### Prerequisites

**Install:**
- Node.js
- PostgreSQL
- npm



### Installation

1. **Clone repo**:
    ```bash
    git clone <url>
    cd into it.
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    
    Create a `.env.development` file in the root directory.
    Inside `.env.development`, add:
    ```PGDATABASE=your_development_database_name```

4. **Set up database**
    ```bash
    npm run setup-dbs
    ```

5. **Seed database**
    ```bash
    npm run seed
    ```

### Runnning the server
    
    npm run dev
    

### Testing

To run the tests, create a .env.test file in the root directory:
    ```
    PGDATABASE=your_test_database_name
    ```

Run the tests:
    
    npm test



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
