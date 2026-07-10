# Domain Model for Presstronic Academy

## Glossary

### User

A person who interacts with the system. Users can be students, instructors, or administrators.

### Student

A user who is enrolled in courses and progresses through learning paths.

### Instructor

A user who creates and manages content for courses.

### Administrator

A user who has elevated privileges to manage system-wide settings and users.

### Course

A structured learning path that contains lessons and challenges.

### Lesson

A unit of instruction within a course, containing content and exercises.

### Challenge

A coding exercise or puzzle that students must complete to progress.

### Progression

The state of a student's journey through courses and lessons.

### Tenant

A logical grouping of users, courses, and data for multi-tenancy support.

### Authentication

The process of verifying a user's identity using credentials.

### Authorization

The process of determining what actions a user can perform within the system.

### JWT

JSON Web Token used for authentication and session management.

### Refresh Token

A token used to obtain new access tokens without re-authentication.

### Multi-tenancy

A software architecture that allows multiple organizations to share the same application instance while maintaining data isolation.
