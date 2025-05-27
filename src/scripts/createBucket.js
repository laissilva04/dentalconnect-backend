const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL e SUPABASE_KEY são necessários no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  try {
    // Criar o bucket
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB em bytes
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Bucket "avatars" já existe');
      } else {
        throw bucketError;
      }
    } else {
      console.log('Bucket "avatars" criado com sucesso');
    }

    // Configurar políticas de acesso via SQL
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      policy_name: 'allow_upload',
      policy_definition: {
        role: 'authenticated',
        operation: 'INSERT'
      }
    });

    if (policyError) {
      console.error('Erro ao criar política de upload:', policyError);
    } else {
      console.log('Política de upload criada com sucesso');
    }

    // Política para leitura pública
    const { error: readPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      policy_name: 'allow_public_read',
      policy_definition: {
        role: '*',
        operation: 'SELECT'
      }
    });

    if (readPolicyError) {
      console.error('Erro ao criar política de leitura:', readPolicyError);
    } else {
      console.log('Política de leitura pública criada com sucesso');
    }

    console.log('Configuração do bucket concluída');
  } catch (error) {
    console.error('Erro ao configurar bucket:', error);
  }
}

createBucket(); 