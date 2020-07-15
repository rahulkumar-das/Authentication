# Authentication
This repository can be used as a template code in any website building project that requires a login, register and password reset using email modules. To store the passwords in a secured format the password is hashed using SHA-512 and is then stored in the database. As the passwords are stored in a hashed format, even the database admin cannot see the users password. So for the reset forward, using the mail-gun api email is sent to the user's registered email id with a reset URL which will be valid only for 60 mins. On successful password reset a confirmation email is also sent to the registered user's email id.

## Preview of reset url email with instructions
![Capture1](https://user-images.githubusercontent.com/48314756/87554739-24241e00-c6d2-11ea-92ef-04ddf0a89757.JPG)

## Preview of confirmation email
![Capture2](https://user-images.githubusercontent.com/48314756/87554767-2d14ef80-c6d2-11ea-97ab-f97f3897a466.JPG)
