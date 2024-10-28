# Emergency Blood Donation Web Application

This project is an Emergency Blood Donation web application built using React and Vite. It aims to connect blood donors with those in need of blood donations.

## Features

- User registration and authentication
- Blood donation requests
- Donor information forms
- User dashboard
- Donation information and FAQ
- Responsive design

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Setup and Installation

1. Clone the project repository to your local machine.
2. Navigate to the project directory in your terminal.

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   VITE_apiKey=your_api_key
   VITE_authDomain=your_auth_domain
   VITE_projectId=your_project_id
   VITE_storageBucket=your_storage_bucket
   VITE_messagingSenderId=your_messaging_sender_id
   VITE_appId=your_app_id
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open your web browser and navigate to `http://localhost:5173` (or the port specified in the terminal output).

## Project Structure

- `src/Components`: Contains React components for different pages and features
- `src/providers`: Includes the AuthProvider for managing authentication state
- `src/firebase`: Firebase configuration
- `src/assets`: Static assets like images
- `public`: Public assets and index.html

## Technologies Used

- React
- Vite
- Firebase (Authentication)
- Tailwind CSS
- React Router

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
# emergency_blood_donation_management_system
