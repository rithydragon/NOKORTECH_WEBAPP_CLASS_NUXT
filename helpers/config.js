export default {
    BASE_URL: 'https://your-api-url.com/', // Base URL for the API
    apiPaths: {
      studentEnrollment: {
        list: 'api/student/list', // Path to get the list of students
        create: 'api/student/create', // Path to create a new student
        update: 'api/student/update', // Path to update an existing student
      },
      otherEndpoints: {
        login: 'api/auth/login', // Example other endpoint
      }
    }
  };
  