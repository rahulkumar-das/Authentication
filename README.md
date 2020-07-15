# Authentication
This repository can be used as a template code in any website building project that requires a login, register and password reset using email modules. To store the passwords in a secured format the password is hashed using SHA-512 and is then stored in the database. As the passwords are stored in a hashed format, even if anyone gets access to the database, the passwords  are in encrypted format and hence secured. To implemet the reset forward functionality, the mail-gun api email is used to send the reset URL which has a unique token associated with the user's account on the registered email Id. On successful password reset a confirmation email is also sent to the user's registered email id. Developed using Node.js and MongoDB

## Preview of reset url email with instructions
![Capture1](https://user-images.githubusercontent.com/48314756/87554739-24241e00-c6d2-11ea-92ef-04ddf0a89757.JPG)

## Preview of confirmation email
![Capture2](https://user-images.githubusercontent.com/48314756/87554767-2d14ef80-c6d2-11ea-97ab-f97f3897a466.JPG)
