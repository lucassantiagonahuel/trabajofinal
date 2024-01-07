export const generateUserErrorInfo = (product) =>{
    return `Properties incomplete o not valid
    List example required properties
    * Code : needs too be alphanumeric received ${product.code}
    * Stock : needs too be number received ${product.stock}
    `
}