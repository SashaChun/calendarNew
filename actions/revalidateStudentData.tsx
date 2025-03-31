'use server';

import { revalidatePath } from 'next/cache'; ;

export async function revalidateProduct(productId : any) {
    revalidatePath(`/${productId}`);
}
