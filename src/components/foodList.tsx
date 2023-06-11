import React from 'react';

type Props = {
  list: Food[];
  identifier: string;
};

const FoodList = (props: Props) => {
  const { list, identifier } = props;
  return (
    <ul>
      {list?.map(({ value }) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return (
          <li
            key={value + identifier}
            style={{
              color: `#${randomColor}`,
              listStyle: 'none',
              textTransform: 'capitalize',
            }}
          >
            {value}
          </li>
        );
      })}
    </ul>
  );
};

export default FoodList;
