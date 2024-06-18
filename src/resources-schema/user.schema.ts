import { object, string } from "zod";

export const signUpSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
    email: string({
      required_error: "email is required",
    }),
    password: string({
      required_error: "password is required",
    }),
  }),
});




export const loginSchema = object({
  body: object({
    email: string({
      required_error: "email is required",
    }),
    password: string({
      required_error: "password is required",
    }),
  }),
});



export const activateSchema = object({
    query : object({
        token : string({
            required_error : "token is required"
        })
    })
})





export const forgotPasswordSchema = object({
    body : object({
        email : string({
            required_error : "token is required"
        })
    })
})

export const changePasswordSchema = object({
    body : object({
        oldPassword : string({
            required_error : "old password is required"
        }),
        newPassword : string({
            required_error : "new password is required"
        })
    })
})
