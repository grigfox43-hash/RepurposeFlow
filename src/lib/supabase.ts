// Supabase integration helper with graceful fallback
export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export interface DatabaseSchemaNotice {
  status: 'connected' | 'demo_mode';
  message: string;
}

export function getDatabaseStatus(): DatabaseSchemaNotice {
  if (isSupabaseConfigured()) {
    return {
      status: 'connected',
      message: 'Подключено к Supabase PostgreSQL'
    };
  }
  return {
    status: 'demo_mode',
    message: 'Локальное хранилище (Demo / Standalone Mode)'
  };
}
