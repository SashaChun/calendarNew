'use server';

import { revalidatePath } from 'next/cache';

type  revalidateProductType = {
    productId : string
}

export async function revalidateProduct(productId : revalidateProductType) {
    revalidatePath(`/${productId}`);
}
