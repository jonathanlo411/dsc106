import pandas as pd

def flatten_genres(target):
    """ Givem a target to flatten, returns a list of only that tag.
    """
    if not isinstance(target, list):
        return pd.NA
    flattened = []
    for o in target:
        flattened.append(o["name"])
    return flattened

def parse_year(df):
    """ Given a dataframe, parses the year from the format YYYY-MM-DD
    """
    return df['start_date'].astype(str).apply(lambda x: x[:4]).astype(int, errors='ignore')