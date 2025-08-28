import { Client, TablesDB, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID; // renamed from COLLECTION_ID

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const tablesdb = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Query rows where searchTerm matches
    const result = await tablesdb.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal('searchTerm', searchTerm),
      Query.limit(1),
    ]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      // 2. Update count
      await tablesdb.updateRow(
        DATABASE_ID,
        TABLE_ID,
        row.$id,
        {
          searchTerm,
          count: row.count + 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    } else {
      // 3. Create new row
      await tablesdb.createRow(
        DATABASE_ID,
        TABLE_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
        // Remove permissions argument if not needed, or provide correct permissions array
      );
    }
  } catch (error) {
    console.error('Error updating search count with TablesDB:', error);
    throw error;
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await tablesdb.listRows(DATABASE_ID, TABLE_ID, [
      Query.orderDesc('count'),
      Query.limit(5),
    ]);

    return result.rows;
  } catch (error) {
    console.error('Error fetching trending movies with TablesDB:', error);
    throw error;
  }
};
