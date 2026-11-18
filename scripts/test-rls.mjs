import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

// Somente banco Supabase LOCAL isolado. Nunca executar com segredos de produção.
const url = process.env.TEST_SUPABASE_URL;
assert(
  url && ['localhost', '127.0.0.1'].includes(new URL(url).hostname),
  'Use TEST_SUPABASE_URL local isolado.',
);
const anonKey = process.env.TEST_SUPABASE_ANON_KEY;
const serviceKey = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY;
assert(anonKey && serviceKey, 'Configure as chaves locais de teste.');
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const client = () => createClient(url, anonKey, { auth: { persistSession: false } });
const password = 'Test-only-32-char-password-RLS!';
const suffix = Date.now();
const users = [];
let productId, categoryId;
try {
  for (const role of ['admin', 'reader']) {
    const email = `${role}-${suffix}@example.test`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    assert.ifError(error);
    users.push(data.user);
  }
  assert.ifError((await admin.from('admin_users').insert({ user_id: users[0].id })).error);
  const authed = client(),
    reader = client();
  assert.ifError((await authed.auth.signInWithPassword({ email: users[0].email, password })).error);
  assert.ifError((await reader.auth.signInWithPassword({ email: users[1].email, password })).error);
  const category = {
    name: 'Categoria RLS',
    slug: `rls-${suffix}`,
    description: 'Teste isolado',
    display_order: 99,
    is_active: true,
  };
  assert((await anon.from('categories').insert(category)).error, 'Anon não pode escrever');
  assert(
    (await reader.from('categories').insert(category)).error,
    'Usuário comum não pode escrever',
  );
  const created = await authed.from('categories').insert(category).select('id').single();
  assert.ifError(created.error);
  categoryId = created.data.id;
  const product = {
    title: 'Produto de teste RLS',
    slug: `teste-rls-${suffix}`,
    summary: 'Resumo de teste isolado',
    description: 'Descrição editorial somente de teste isolado.',
    affiliate_url: 'https://www.amazon.com.br/dp/B000000001?tag=testeisolado-20',
    category_id: categoryId,
    status: 'draft',
  };
  const draft = await authed.from('products').insert(product).select('id').single();
  assert.ifError(draft.error);
  productId = draft.data.id;
  assert.equal((await anon.from('products').select('id').eq('id', productId)).data.length, 0);
  assert.equal((await reader.from('products').select('id').eq('id', productId)).data.length, 0);
  assert.equal(
    (await reader.from('products').update({ status: 'published' }).eq('id', productId).select('id'))
      .data.length,
    0,
  );
  assert.ifError(
    (await authed.from('products').update({ status: 'published' }).eq('id', productId)).error,
  );
  assert.equal((await anon.from('products').select('id').eq('id', productId)).data.length, 1);
  assert(
    (await authed.from('categories').update({ is_active: false }).eq('id', categoryId)).error,
    'Categoria ocupada não pode ser desativada',
  );
  assert(
    (await authed.from('categories').delete().eq('id', categoryId)).error,
    'Categoria ocupada não pode ser excluída',
  );
  assert(
    (
      await authed
        .from('products')
        .update({ affiliate_url: 'https://evil.com/dp/B000000001?tag=testeisolado-20' })
        .eq('id', productId)
    ).error,
  );
  assert.ifError(
    (await authed.from('products').update({ status: 'archived' }).eq('id', productId)).error,
  );
  assert.equal((await anon.from('products').select('id').eq('id', productId)).data.length, 0);
  assert(
    (await reader.from('admin_users').insert({ user_id: users[1].id })).error,
    'Sem autoatribuição de administrador',
  );
  console.log(
    'RLS: anon, usuário comum e administrador; rascunho/publicação/arquivamento; constraints verificados.',
  );
} finally {
  if (productId) await admin.from('products').delete().eq('id', productId);
  if (categoryId) await admin.from('categories').delete().eq('id', categoryId);
  for (const user of users) await admin.auth.admin.deleteUser(user.id);
}
