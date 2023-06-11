import { Fragment, useEffect, useState } from 'react';
import FoodList from 'src/components/foodList';
import { useAuth } from 'src/hooks/useAuth';
import { supabase } from 'src/supabaseClient';

type Props = {};

const Friends = (props: Props) => {
  const [allProfiles, setAllProfiles] = useState<any>([]);
  const { currentUser } = useAuth();

  const fetchAllProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(
        `
            name,
            foods (
              value
            )
          `
      )
      .neq('id', currentUser.id);

    setAllProfiles(data);
  };
  useEffect(() => {
    fetchAllProfiles();
  }, []);

  return (
    <ul>
      {allProfiles?.map((profile: Profile, index: number) => (
        <Fragment key={profile.id + index}>
          <li>{profile.name}</li>
          <FoodList list={profile.foods} identifier={profile.name} />
        </Fragment>
      ))}
    </ul>
  );
};

export default Friends;
