D = '#0E1214'
def wrap(inner): return f'<g fill="{D}" stroke="{D}" stroke-linecap="round" stroke-linejoin="round">{inner}</g>'
LEGS = ('<path d="M98 26 L10 27" stroke-width="12" fill="none"/><path d="M10 27 L3 15" stroke-width="9" fill="none"/>'
        '<path d="M98 24 L70 -4 L42 26" stroke-width="12" fill="none"/><path d="M42 26 L28 28" stroke-width="9" fill="none"/>')
TORSO = '<path d="M98 14 L152 10 L168 16 L168 30 L152 32 L98 30 Z" stroke-width="7"/>'
V = {}
# v0: what the icon has now (raised arm beside the head, small curls)
V['v0'] = wrap(LEGS + TORSO + '<path d="M156 12 L174 -4 L194 6" stroke-width="9" fill="none"/>'
  '<circle cx="188" cy="20" r="12" stroke="none"/><circle cx="182" cy="10" r="6" stroke="none"/><circle cx="192" cy="8" r="6" stroke="none"/><circle cx="200" cy="14" r="5.5" stroke="none"/>')
# pass 1: remove the raised arm that sat on the head; clean round head, neck, curls on top
V['v1'] = wrap(LEGS + TORSO + '<path d="M166 22 L180 21" stroke-width="9" fill="none"/>'
  '<circle cx="187" cy="21" r="12.5" stroke="none"/><circle cx="182" cy="11" r="6.5" stroke="none"/><circle cx="191" cy="9" r="6.5" stroke="none"/><circle cx="199" cy="14" r="6" stroke="none"/><circle cx="201" cy="23" r="5.5" stroke="none"/>')
# pass 2: face-up profile: small nose, hair gathered on the back and top of the head resting on the sand
V['v2'] = wrap(LEGS + TORSO + '<path d="M166 22 L180 21" stroke-width="10" fill="none"/>'
  '<ellipse cx="187" cy="21" rx="12" ry="13" stroke="none"/><circle cx="179" cy="8.5" r="3.4" stroke="none"/>'
  '<circle cx="193" cy="9" r="6.5" stroke="none"/><circle cx="202" cy="15" r="7" stroke="none"/><circle cx="204" cy="25" r="6.5" stroke="none"/><circle cx="198" cy="33" r="6" stroke="none"/>')
# pass 3: tune proportions: slightly smaller head, fuller neck and shoulder, hair as an even cluster
V['v3'] = wrap(LEGS + '<path d="M98 14 L150 9 L166 15 L168 31 L150 33 L98 30 Z" stroke-width="7"/><path d="M160 21 L178 21" stroke-width="11" fill="none"/>'
  '<ellipse cx="186" cy="21" rx="11" ry="12" stroke="none"/><circle cx="178.5" cy="9.5" r="3" stroke="none"/>'
  '<circle cx="191" cy="9.5" r="6" stroke="none"/><circle cx="199.5" cy="14.5" r="6.5" stroke="none"/><circle cx="201.5" cy="23.5" r="6" stroke="none"/><circle cx="196" cy="31" r="5.5" stroke="none"/>')
V['v4'] = V['v3'].replace('<circle cx="178.5" cy="9.5" r="3" stroke="none"/>', '<circle cx="178" cy="11.5" r="4" stroke="none"/>')
assert V['v4'] != V['v3']
def get(k): return V[k]
