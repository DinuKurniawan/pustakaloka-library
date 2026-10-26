import { read, write } from '../utils/storage.js';

const KEY = 'pustakaloka:members';

export async function registerMember(values) {
  const member = {
    ...values,
    memberNo: `MBR-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  };
  write(KEY, [member, ...read(KEY, [])]);
  return member;
}
