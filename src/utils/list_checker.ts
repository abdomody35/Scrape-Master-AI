const checkLists = (white_list: string[], black_list: string[]) => {
  validateLists(white_list, black_list);
  const common_list = white_list.filter((link) => black_list.includes(link));
  return common_list.length === 0;
};

const checkRegex = (
  link: string,
  white_list: string[],
  black_list: string[]
) => {
  const white_matches = white_list.filter((regex) => link.match(RegExp(regex)));
  const black_matches = black_list.filter((regex) => link.match(RegExp(regex)));
  return (
    (white_list.length === 0 || white_matches.length > 0) &&
    black_matches.length === 0
  );
};

const validateLists = (whiteList: string[], blackList: string[]) => {
  if (whiteList === undefined) whiteList = [];
  if (blackList === undefined) blackList = [];
};

export { checkLists, checkRegex, validateLists };
