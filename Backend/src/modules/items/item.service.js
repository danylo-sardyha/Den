let mockData = [
  {
    id: 1,
    title: "The Dispossessed",
    format: "Book",
    status: "Completed",
    rating: 5,
  },
  {
    id: 2,
    title: "Disco Elysium",
    format: "Video Game",
    status: "Completed",
    rating: 5,
  },
  {
    id: 3,
    title: "Annihilation",
    format: "Movie",
    status: "Completed",
    rating: 4,
  },
];

export const fetchAllItems = async () => {
  return mockData;
};

export const fetchItemById = async (id) => {
  return mockData.find((item) => item.id === parseInt(id));
};

export const insertItem = async (itemData) => {
  const newItem = { id: Date.now(), ...itemData };
  mockData.unshift(newItem);
  return newItem;
};

export const updateItem = async (id, itemData) => {
  const index = mockData.findIndex((item) => item.id === parseInt(id));
  if (index === -1) return null;

  mockData[index] = { ...mockData[index], ...itemData };
  return mockData[index];
};

export const deleteItem = async (id) => {
  mockData = mockData.filter((item) => item.id !== parseInt(id));
};
