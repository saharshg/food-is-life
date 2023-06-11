import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { supabase } from '../supabaseClient';
import { useAuth } from 'src/hooks/useAuth';
import Friends from './friends';
import FoodList from 'src/components/foodList';

export function App() {
  const [myFood, setMyFood] = useState([]);
  const { currentUser } = useAuth();

  const getMyFood = () => {
    supabase
      .from('foods')
      .select('value')
      .eq('profile_id', currentUser?.id)
      .then(({ data }: { data: any }) => {
        setMyFood(data);
      });
  };

  useEffect(() => {
    getMyFood();

    const foodUpdateChannel = supabase
      .channel('foods-update-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'foods',
          filter: `profile_id=eq.${currentUser?.id}`,
        },
        () => {
          getMyFood();
        }
      )
      .subscribe();

    return () => {
      foodUpdateChannel.unsubscribe();
    };
  }, []);

  const storeFood = async (e: any) => {
    e.preventDefault();

    await supabase.from('foods').insert({
      value: e.target.elements.food.value,
      profile_id: currentUser.id,
    });
  };

  return (
    <>
      <form onSubmit={storeFood}>
        <h1>Hi, {currentUser?.user_metadata?.name}!</h1>
        <h2>What are you eating?</h2>
        <input name='food' type='text' />
      </form>
      <section className={styles.mainContent}>
        <FoodList list={myFood} identifier={currentUser?.user_metadata?.name} />
        <Friends />
      </section>
    </>
  );
}

export default App;
