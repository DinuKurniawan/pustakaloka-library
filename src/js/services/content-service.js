import { categories } from '../data/categories.js';
import { faqs } from '../data/faqs.js';
import { librarians } from '../data/librarians.js';
import { posts } from '../data/posts.js';
import { services } from '../data/services.js';

export const getCategories = async () => categories;
export const getCategoryById = async (id) =>
  categories.find((category) => category.id === id) ?? categories[0];
export const getServices = async () => services;
export const getLibrarians = async () => librarians;
export const getPosts = async ({ category = '', page = 1, perPage = 6 } = {}) => {
  const filtered = category ? posts.filter((post) => post.category === category) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  return {
    items: filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
    total: filtered.length,
    page: currentPage,
    totalPages,
  };
};
export const getPostById = async (id) => posts.find((post) => post.id === id) ?? null;
export const getFaqs = async () => faqs;
