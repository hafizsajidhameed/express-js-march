export const createVlidationSchema = {
    username: {
        isLength: {
            option: {
                min: 5,
                max: 10
            },
            errorMessage: 'username should be between 5 and 10 characters',
        },
        notEmpty: {
            errorMessage: 'username cannot be empty'
        },
        isString: {
            errorMessage: "username must be string"
        }


    },
    displayname: {
        notEmpty: {
            errorMessage: "must not be empty"
        }
    }
}