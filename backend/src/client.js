import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usltgwtqbzxtbqhtjarh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbHRnd3RxYnp4dGJxaHRqYXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1OTk0NTcsImV4cCI6MjA1NTE3NTQ1N30.Lw7YpG8UT7vNspzLTMbrkXtj8rneINW5QEByudwYYgw'
export const supabase = createClient(supabaseUrl, supabaseKey)