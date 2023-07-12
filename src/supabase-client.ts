import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { useEffect } from 'react';

type TSubscriptionParams = {
  entity: 'tracks';
  onDataUpdated: (payload: unknown) => void;
};

export const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export function useSubscription(subscriptions: TSubscriptionParams[]) {
  useEffect(() => {

    const channel = client
      .channel('any');

    subscriptions.forEach(subscriptionConfig => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table: subscriptionConfig.entity }, (payload) => {
        subscriptionConfig.onDataUpdated(payload);
      })
    });

    channel.subscribe();

    return () => {
      client.removeChannel(channel);
    }
  }, [subscriptions]);
}
