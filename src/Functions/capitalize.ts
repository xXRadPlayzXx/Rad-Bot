var capitalize: Function = async (text: string): Promise<string> => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export = capitalize;
