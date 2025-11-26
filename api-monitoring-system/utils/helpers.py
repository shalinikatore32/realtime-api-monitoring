# small utilities, for now keep empty or add helpers like formatting
def pretty_print(doc):
    import json
    print(json.dumps(doc, indent=2, default=str))
