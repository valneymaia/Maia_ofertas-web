-- Nova origem informativa. Não equivale a comprovação de licença da imagem.
begin;
alter table public.products drop constraint products_image_source_check;
alter table public.products add constraint products_image_source_check
  check (image_source in ('placeholder','own','licensed','amazon_metadata'));
alter table public.products add constraint products_amazon_metadata_image_check
  check (image_source <> 'amazon_metadata' or image_url ~ '^https://(m\.media-amazon\.com|images-na\.ssl-images-amazon\.com|images-eu\.ssl-images-amazon\.com)/images/I/[^?#]+\.(jpg|jpeg|png|webp)$');
commit;
