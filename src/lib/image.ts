export async function compressImage(file: File, maxW=1600, quality=0.78): Promise<string>{
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxW / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width*scale), h=Math.round(bmp.height*scale)
  const c=document.createElement('canvas'); c.width=w; c.height=h
  const ctx=c.getContext('2d')!; ctx.drawImage(bmp,0,0,w,h)
  return c.toDataURL('image/jpeg', quality)
}
