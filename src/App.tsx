import React, { useCallback } from "react";

import { User as FirebaseUser } from "firebase/auth";
import {getDocs, collection, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app"
import logo from "./assets/logo_icon.png";
import { EnumValues } from "@camberi/firecms";
import { textSearchController } from "./text_search";
import { CustomLoginView } from "./CustomLoginView";

// import { initializeApp, firestore } from "firebase-admin"





import {
    Authenticator,
    buildCollection,
    buildProperty,
    EntityReference,
    FirebaseCMSApp
} from "@camberi/firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

const firebaseConfig = {
  apiKey: "AIzaSyD6ZMI1e5zfRjuz8KQVRhW1b8YNPIDYV0s",
  authDomain: "auzaarpay.firebaseapp.com",
  projectId: "auzaarpay",
  storageBucket: "auzaarpay.appspot.com",
  messagingSenderId: "42080808235",
  appId: "1:42080808235:web:2b46c8a4384eee5845296e",
  measurementId: "G-27ED633TE9"
};
const app = initializeApp(firebaseConfig);

const locales = {
    "en-US": "English (United States)"
};


type Product = {
    name: string;
    brand: string;
    price: string;
    referralPercentage: string;
    top: boolean;
    tag: string;
    sizes : string[];
    deliveryAndReturn: string;
    imageURL: string;
    description: string;
    category: string;
    details: {
        Brand: string;
        ShelfLife: string;
        Storage: string;
        Weight: string;

    },
}

type Cart = {
    userId: string,
    userName: string,
    amount: number,
   
 
}

type CartProducts = {
        price: string,
        productID: string,
        productName: string,
        quantity: string,
        size: string,
}


type User = {
    name: string;
    phone: string;
    aadharCard: string;
    aadharNo: string;
    panCard: string;
    panNo: string;
    category: string;
    profileImage: string;
    accountNo: string;
    ifscCode: string;
    bankName: string;
    branch : string;
    upi: string;
    rBalance: string;
    nrBalance: string;
    kyc: boolean;
    address: string;
    zip: string;
}

type Category = {
    imageURL: string;
    name: string;
    top: boolean;
    
}

type SubCategory = {
    imageURL: string;
    name: string;
    
}

type Transaction = {
    commission: string;
    createdTime: Date;
    orderId: string;
    type:string;
    userId:string;
    
}
type Role = {
    email: string;
    role: string;
    
    
}

type Order = {
    orderId: string;
  createdTime: Date;
  paymentMethod: string;
  totalAmount: string;
  commission: string;
  invoice: string;
  paymentLink: string;
  status : string;
  userId: string;
  salesOrderID: string;
 
  customerDetails: {
      name: string;
      phone: string;
      address: string;
      landmark: string;
      pincode: string;
      city: string;
      state: string;



  },
}

const localeCollection = buildCollection({
    path: "locale",
    customId: locales,
    name: "Locales",
    singularName: "Locales",
    properties: {
        name: {
            name: "Title",
            validation: { required: true },
            dataType: "string"
        },
        selectable: {
            name: "Selectable",
            description: "Is this locale selectable",
            dataType: "boolean"
        },
        video: {
            name: "Video",
            dataType: "string",
            validation: { required: false },
            storage: {
                storagePath: "videos",
                acceptedFiles: ["video/*"]
            }
        }
    }
});


const cartSubCollection = buildCollection<CartProducts>({
    textSearchEnabled:true,

    name: "Products",
    singularName: "Product",
    path: "cart",
    group: "AuzaarPay",

    
   
    permissions: ({ authController }) => ({
        edit: false,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    properties: {
        productID: {
            name: "Product ID",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        productName: {
            name: "Product Name",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        quantity: {
            name: "Quantity",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        size: {
            name: "Size",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        price: {
            name: "Price",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
    }

});

const cartCollection = buildCollection<Cart>({
    name: "Carts",
    textSearchEnabled:true,

    group: "AuzaarPay",
    icon: "ShoppingCart",

    singularName: "Cart",
    path: "userCarts",
    permissions: ({ authController }) => ({
        edit: false,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    subcollections: [cartSubCollection],
    properties: {
        userId: {
            name: "User ID",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        userName: {
            name: "User Name",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        amount: {
            name: "Amount",
            validation: { required: true },
            dataType: "number",
            disabled: true,
            
        },
  
    }

});
const roles: EnumValues = {
    admin: "Admin Access",
    user: "User Access",
    category: "Category Access",
    manager: "Manager Access",};

const rolesCollection = buildCollection<Role>({
    textSearchEnabled:true,

    group: "AuzaarPay",
    
    name: "Roles",
    icon:"People",
    singularName: "Role",
    path: "roles",
    permissions: ({ authController }) => ({
        edit: true,
        create: true,
        // we have created the roles object in the navigation builder
        delete: true
    }),
    properties: {
       
        email: {
            name: "Email",
            validation: { required: true },
            dataType: "string",
            
        },

        role: {
            name: "Role",
            validation: { required: true },
            dataType: "string",
            enumValues: roles            
        },

  
    }

});

const categoriesCollection = buildCollection<Category>({
    name: "Categories",
    singularName: "Category",
    path: "categories",
    group: "AuzaarPay",
    icon:"Category",

    textSearchEnabled:true,


    permissions: ({ authController }) => ({
        edit: true,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    properties: {

        imageURL: buildProperty({ // The `buildProperty` method is a utility function used for type checking
            name: "Category Picture",
            dataType: "string",
            storage: {
                storagePath: "categoryImage",
                acceptedFiles: ["image/*"],
                storeUrl: true,
            },

        }),
       
        name: {
            name: "Name",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        top: {
            name: "Show on HomePage",
            validation: { required: true },
            dataType: "boolean",
           
          },
  
    }

});

const subCategoriesCollection = buildCollection<SubCategory>({
    name: "Sub Categories",
    singularName: "Sub Category",
    path: "subCategories",
    icon:"Category",

    group: "AuzaarPay",
    textSearchEnabled:true,


    permissions: ({ authController }) => ({
        edit: true,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    properties: {

        imageURL: buildProperty({ // The `buildProperty` method is a utility function used for type checking
            name: "Category Picture",
            dataType: "string",
            storage: {
                storagePath: "categoryImage",
                acceptedFiles: ["image/*"],
                storeUrl: true,
            },

        }),
       
        name: {
            name: "Name",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
       
  
    }

});

const userCollection = buildCollection<User>({
    name: "Users",
    singularName: "User",
    path: "users",
    group: "AuzaarPay",
    icon: "Person",
    textSearchEnabled:true,

    permissions: ({ authController }) => ({
        edit: true,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
   
    properties: {
         profileImage: buildProperty({ // The `buildProperty` method is a utility function used for type checking
            name: "Display Picture",
            dataType: "string",
            storage: {
                storagePath: "images",
                acceptedFiles: ["image/*"]
            },
            disabled: true,

        }),
       
       
    name: {
            name: "Name",
            validation: { required: true },
            dataType: "string",
            disabled: true,
            
        },
        category: {
            name: "Category",
            validation: { required: true },
            dataType: "string",
            previewAsTag: true,
            disabled: true,
        },
        phone: {
          name: "Phone",
          validation: { required: true },
          dataType: "string",
          disabled: true,
      },
      aadharCard: {
        name: "Aadhar Card",
        validation: { required: true },
        dataType: "string",
        url: true,
        disabled: true,
    },

   
      
     
    aadharNo: {
        name: "Aadhar Number",
        validation: { required: true },
        dataType: "string",
        disabled: true,
    },
    panCard: {
        name: "Pan Card",
        validation: { required: true },
        dataType: "string",
        url: true,
        disabled: true,
    },
  
  panNo: {
    name: "Pan Number",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
kyc: {
  name: "Verify User",
  validation: { required: true },
  dataType: "boolean",
 
},
accountNo: {
    name: "Account Number",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
bankName: {
    name: "Bank Name",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
branch: {
    name: "Bank Branch",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
ifscCode: {
    name: "IFSC Code",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
upi: {
    name: "UPI ID",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
rBalance: {
    name: "Redeemable Balance",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
nrBalance: {
    name: "Non-Redeemable Balance",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},

address: {
    name: "Address",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},
zip: {
    name: "Zip Code",
    validation: { required: true },
    dataType: "string",
    disabled: true,
},

 
  
       
       
    }
});

const productsCollection = buildCollection<Product>({
    name: "Products",
    singularName: "Product",
    path: "products",
    textSearchEnabled:true,

    group: "AuzaarPay",

    permissions: ({ authController }) => ({
        edit: true,
        create: true,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    
    properties: {
        name: {
            name: "Name",
            validation: { required: true },
            dataType: "string"
        },
        tag: {
          name: "Tag",
          validation: { required: true },
          dataType: "string"
      },
      brand: {
        name: "Brand",
        validation: { required: true },
        dataType: "string"
    },
    deliveryAndReturn: {
      name: "Delivery & Return",
      validation: { required: true },
      dataType: "string"
  },
  category: {
    name: "Category",
    validation: { required: true },
    dataType: "string"
},
top: {
  name: "Top Product",
  validation: { required: true },
  dataType: "boolean"
},
   
        price: {
            name: "Price",
            validation: {
                required: true,
                requiredMessage: "You must set a price between 0 and 100000",
                min: 0,
                max: 100000
            },
            description: "Price with range validation",
            dataType: "string"
        },
        referralPercentage: {
          name: "Referral Percentage",
          validation: {
              required: true,
              requiredMessage: "You must set a percentage between 0 and 100",
              min: 0,
              max: 100
          },
          description: "Price with range validation",
          dataType: "string"
      },
        details: {
          name: "Details",
          description: "This is an example of a map property",
          dataType: "map",
          properties: {
              Brand: {
                  name: "Brand",
                  dataType: "string"
              },
              ShelfLife: {
                  name: "Shelf Life",
                  dataType: "string"
              },
              Weight: {
               name : "Weight",
               dataType: "string"

              },
              Storage: {
                name : "Storage",
                dataType: "string"

              }

          }
      },
  
        imageURL: buildProperty({ // The `buildProperty` method is a utility function used for type checking
            name: "Image",
            dataType: "string",
            storage: {
                storagePath: "images",
                acceptedFiles: ["image/*"]
            }
        }),
        sizes: {
            name: "Sizes",
            description: "Example of generic array",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string"
            }
        },
        description: {
            name: "Description",
            description: "Not mandatory but it'd be awesome if you filled this up",
            longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
            dataType: "string",
            columnWidth: 300
        },

    }
});

const ordersCollection = buildCollection<Order>({
  name: "Orders",
  singularName: "Order",
  path: "userOrders",
  group: "AuzaarPay",
  textSearchEnabled:true,
  icon:"Article",


  permissions: ({ authController }) => ({
      edit: false,
      create: false,
      // we have created the roles object in the navigation builder
      delete: false
  }),
  
  properties: {
    orderId: {
        name: "Order ID",
        validation: { required: true },
       
        dataType: "string"
    },
    salesOrderID: {
        name: "Sales Order ID",
        validation: { required: true },
       
        dataType: "string"
    },
    createdTime: {
          name: "Created Time",
          validation: { required: true },
         
          dataType: "date"
      },
      paymentMethod: {
        name: "Payment Method",
        validation: { required: true },
        disabled : true,
        dataType: "string"
    },
    totalAmount: {
      name: "Total",
      validation: { required: true },
      dataType: "string",
      disabled : true,
  },
  commission: {
    name: "Commission",
    validation: { required: true },
    dataType: "string",
    disabled : true,
},
invoice: {
    name: "Invoice",
    validation: { required: true },
    url: true,
    dataType: "string",
    disabled : true,
},
// invoice: buildProperty({ // The `buildProperty` method is a utility function used for type checking
//     name: "Invoice",
//     dataType: "string",
//     config:{
//         url: File,
//       },
//       disabled: false,
//     storage: {
//         storagePath: "images",
//         acceptedFiles: ["image/*"]
//     }
// }),


paymentLink: {
  name: "Payment Link",
  validation: { required: true },
  disabled : true,
  dataType: "string"
},

status: {
  name: "Status",
  validation: { required: true },
  dataType: "string"
},

userId: {
  name: "User ID",
  validation: { required: true },
  disabled : true,
  dataType: "string"
},


      customerDetails: {
        name: "Customer Details",
        description: "This is an example of a map property",
        dataType: "map",
        disabled: true,
        properties: {
            name: {
                name: "Name",
                dataType: "string"
            },
            phone: {
                name: "Phone",
                dataType: "string"
            },
            address: {
             name : "Address",
             dataType: "string"

            },
            landmark: {
              name : "Landmark",
              dataType: "string"

            },
            pincode: {
              name : "Pincode",
              dataType: "string"

            },
            city: {
              name : "City",
              dataType: "string"

            },
            state: {
              name : "State",
              dataType: "string"

            },

        }
    },

     
  }
});

const transactionsCollection = buildCollection<Transaction>({
    name: "Transactions",
    singularName: "Transaction",
    path: "userTransactions",
    group: "AuzaarPay",
    icon: "AttachMoney",
    textSearchEnabled:true,


    permissions: ({ authController }) => ({
        edit: false,
        create: false,
        // we have created the roles object in the navigation builder
        delete: false
    }),
    
    properties: {
      orderId: {
          name: "Order ID",
          validation: { required: true },
         
          dataType: "string"
      },
      userId: {
        name: "User ID",
        validation: { required: true },
        disabled : true,
        dataType: "string"
    },
      createdTime: {
          name: "Created Time",
          validation: { required: true },
         
          dataType: "date"
      },
      commission: {
            name: "Commission",
            validation: { required: true },
           
            dataType: "string"
        },
        type: {
            name: "Transaction Type",
            validation: { required: true },
            dataType: "string",
            previewAsTag: true,
    
            disabled : true,
        },
        
      
   
  
       
    }
  });
  const adminCollections = [
   userCollection, cartCollection, ordersCollection, categoriesCollection, subCategoriesCollection, transactionsCollection,rolesCollection 
];
const managerCollections = [
    userCollection, cartCollection, ordersCollection, categoriesCollection, subCategoriesCollection, transactionsCollection 
 ];
const userCollections = [
    userCollection, 
 ];
 const categoryCollections = [
    categoriesCollection, subCategoriesCollection,
 ];
 const noAccessCollections = [
     
 ];
var roleOfUser = " ";
export default function App() {

    const myAuthenticator: Authenticator<FirebaseUser> = useCallback(async ({
                                                                    user,
                                                                    authController
                                                                }) => {

        if (user?.email?.includes("flanders")) {
            throw Error("Stupid Flanders!");
        }
        const db = getFirestore(app);
        var role2 = " ";
        var flag=false;

        await getDocs(collection(db, "roles"))
            .then((querySnapshot)=>{               
                 querySnapshot.docs
                    .map((x) => {
                        if(x.data()["email"]==user?.email){
                          
                            role2=x.data()['role'];
                            flag=true;
                        }
            
            
                    });
                console.log(role2);
            });
            if(!flag) throw Error("No Access!");
            
                console.log(role2);
       
       
        const sampleUserData = await Promise.resolve({
            roles: [role2]
        });
        roleOfUser = role2;
        authController.setExtra(sampleUserData);
        console.log(sampleUserData)

        console.log("Allowing access to", user?.email);
        // This is an example of retrieving async data related to the user
        // and storing it in the user extra field.
        // const sampleUserRoles = await Promise.resolve(["admin"]);
        // authController.setExtra(sampleUserRoles);

        return true;

            
            
    }, []);

    return <FirebaseCMSApp
        name={"AuzaarPay Admin"}
        logo={logo}
        authentication={myAuthenticator}
        textSearchController={textSearchController}
        LoginView={CustomLoginView}
        
        collections={(params) => roleOfUser=="admin" ? adminCollections: roleOfUser=="user" ? userCollections:roleOfUser=="category"?categoryCollections:  managerCollections}
        firebaseConfig={firebaseConfig}
    />;
}