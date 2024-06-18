import { z } from "zod";
import { Types } from "mongoose"; 

const ObjectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Must be a valid ObjectId",
});

const SocialMediaLink = z.object({
  name: z.string(),
  link: z.string().url(),
});

export const StoreSchema = z.object({
    body : z.object({
        name: z.string(),
        description: z.string(),
        phone: z.string(),
        email: z.string().email(),
        website: z.string().optional(),
        keywords: z.array(z.string()),
        wilaya: z.string(),
        city: z.string(),
        longitude: z.string().optional(),
        latitude: z.string().optional(),
        storeType: z.string(),
        socialMediaLinks: z.array(SocialMediaLink).optional(),
    })
});




export const UpdateStoreSchema = z.object({
    params : z.object({
        storeId : z.string(),
    }),
    body : z.object ({
        name: z.string(),
        description: z.string(),
        phone: z.string(),
        email: z.string().email(),
        website: z.string().optional(),
        keywords: z.array(z.string()),
        wilaya: z.string(),
        city: z.string(),
        longitude: z.string().optional(),
        latitude: z.string().optional(),
        storeType: z.string(),
        socialMediaLinks: z.array(SocialMediaLink).optional(),
    })
})



export const deleteStoreSchema = z.object({
    params : z.object({
        storeId : z.string(),
    })
})


export const getStoreByIdSchema = z.object({
    params : z.object({
        storeId : z.string(),
    })
})


export const filterStoresSchema = z.object({
    query : z.object({
        wilaya : z.string(),
    })
}) 


export const searchStoresSchema = z.object({
    query : z.object({
        searchTerm : z.string(),
    })
})


export const getStoreByNameSchema = z.object({
    query : z.object({
        storeName : z.string(),
    })
})



