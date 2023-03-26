## **Ticket Reservation**

### NodeJS Express With TypeScript

#### Simple JWT Authentication and Simple Authorization

---

#### **TODO**

- [x] **User CRUD**
- - [x] Create a new User
- - [x] Get all Users (admin only)
- - [x] Get a User Profile by ID (self or operator)
- - [x] Check User exists by Phone
- - [x] Delete a User By ID (self or operator)
- - [x] Update a User Profile By ID (self or operator)
- - [x] Upload Avatar
- - [ ] Get All User Order by ID (self or operator)
- - [ ] User Dao
- [x] **Authorization**
- - [x] Authorize Users with Role (Admin, Operator, Client)
- [x] **Authentication**
- - [x] Login API with JWT Token
- [ ] **Ticket CRUD**
- - [x] Get all Tickets
- - [x] Get a Ticket by ID
- - [x] Add a new Ticket (operator only)
- - [x] Modify a Ticket by ID (operator only)
- - [x] Remove a Ticket by ID (operator only)
- - [x] Remove many Tickets by IDs (admin only)
- - [x] Create a Query for filtering Tickets (on Redis)
- - [x] Get Tickets by Query ID
- - - [x] Fix No DateTime Query Bug
- - [ ] Return a HTML Ticket by ID
- [ ] **Order CRUD**
- - [x] Get All Orders (admin only)
- - [x] Get an Order by ID (operator only)
- - [x] Create an Order (with dbTranscation)
- - - [ ] Extra: Check Departure Time of Tickets not arrived yet
- - [x] Auto Cancelling an Order with Cron Job if Client doesn't Pay after a period
- - [ ] Modify an Order by ID (self or operator)
- - [x] Cancel an Order by ID (self or operator)
- - [ ] Pay for an Order by ID
- [ ] **Wallet CRUD**
- - [x] Increase Wallet Balance
- - [ ] Get Wallet Balance (self or operator)
- - - [ ] Update User Balance
- [x] Refresh Token mechanism API
- [ ] Global Midlleware for logging?!?
- [ ] Error generator
- [ ] **Routes Request Validations**
