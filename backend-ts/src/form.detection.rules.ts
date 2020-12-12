export interface Rules {
  '-ba': Rule[];
  '-chau': Rule[];
  '-nasai': Rule[];
  '-sou': Rule[];
  '-sugiru': Rule[];
  '-tai': Rule[];
  '-tara': Rule[];
  '-tari': Rule[];
  '-te': Rule[];
  '-zu': Rule[];
  '-nu': Rule[];
  adv: Rule[];
  causative: Rule[];
  imperative: Rule[];
  'imperative negative': Rule[];
  'masu stem': Rule[];
  negative: Rule[];
  noun: Rule[];
  passive: Rule[];
  past: Rule[];
  polite: Rule[];
  'polite negative': Rule[];
  'polite past': Rule[];
  'polite past negative': Rule[];
  'polite volitional': Rule[];
  potential: Rule[];
  'potential or passive': Rule[];
  volitional: Rule[];
  'causative passive': Rule[];
  '-toku': Rule[];
  'progressive or perfect': Rule[];
}

export interface Rule {
  kanaIn: string;
  kanaOut: string;
  rulesIn: string[];
  rulesOut: string[];
}

export const FormDetectionRules : Rules = {
    "-ba": [
        {
            "kanaIn": "えば",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "けば",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "げば",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "せば",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "てば",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ねば",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "べば",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "めば",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "れば",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "v5",
                "vk",
                "vs"
            ]
        },
        {
            "kanaIn": "ければ",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        }
    ],
    "-chau": [
        {
            "kanaIn": "ちゃう",
            "kanaOut": "る",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いじゃう",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いちゃう",
            "kanaOut": "く",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きちゃう",
            "kanaOut": "くる",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "しちゃう",
            "kanaOut": "す",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しちゃう",
            "kanaOut": "する",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "っちゃう",
            "kanaOut": "う",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "っちゃう",
            "kanaOut": "く",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "っちゃう",
            "kanaOut": "つ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "っちゃう",
            "kanaOut": "る",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んじゃう",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んじゃう",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んじゃう",
            "kanaOut": "む",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-nasai": [
        {
            "kanaIn": "なさい",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いなさい",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きなさい",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きなさい",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎなさい",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しなさい",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しなさい",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちなさい",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "になさい",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びなさい",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みなさい",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りなさい",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-sou": [
        {
            "kanaIn": "そう",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "そう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いそう",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きそう",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きそう",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎそう",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しそう",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しそう",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちそう",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にそう",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びそう",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みそう",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りそう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-sugiru": [
        {
            "kanaIn": "すぎる",
            "kanaOut": "い",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "すぎる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いすぎる",
            "kanaOut": "う",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きすぎる",
            "kanaOut": "く",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きすぎる",
            "kanaOut": "くる",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎすぎる",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しすぎる",
            "kanaOut": "す",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しすぎる",
            "kanaOut": "する",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちすぎる",
            "kanaOut": "つ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にすぎる",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びすぎる",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みすぎる",
            "kanaOut": "む",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りすぎる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-tai": [
        {
            "kanaIn": "たい",
            "kanaOut": "る",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いたい",
            "kanaOut": "う",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きたい",
            "kanaOut": "く",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きたい",
            "kanaOut": "くる",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎたい",
            "kanaOut": "ぐ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "したい",
            "kanaOut": "す",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "したい",
            "kanaOut": "する",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちたい",
            "kanaOut": "つ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にたい",
            "kanaOut": "ぬ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びたい",
            "kanaOut": "ぶ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みたい",
            "kanaOut": "む",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りたい",
            "kanaOut": "る",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-tara": [
        {
            "kanaIn": "たら",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いたら",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いだら",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きたら",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "したら",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "したら",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ったら",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ったら",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ったら",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだら",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだら",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだら",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "かったら",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "のたもうたら",
            "kanaOut": "のたまう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いったら",
            "kanaOut": "いく",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "おうたら",
            "kanaOut": "おう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こうたら",
            "kanaOut": "こう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "そうたら",
            "kanaOut": "そう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とうたら",
            "kanaOut": "とう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "行ったら",
            "kanaOut": "行く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "逝ったら",
            "kanaOut": "逝く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "往ったら",
            "kanaOut": "往く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "請うたら",
            "kanaOut": "請う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "乞うたら",
            "kanaOut": "乞う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "恋うたら",
            "kanaOut": "恋う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "問うたら",
            "kanaOut": "問う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "負うたら",
            "kanaOut": "負う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "沿うたら",
            "kanaOut": "沿う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "添うたら",
            "kanaOut": "添う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "副うたら",
            "kanaOut": "副う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "厭うたら",
            "kanaOut": "厭う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-tari": [
        {
            "kanaIn": "たり",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いたり",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いだり",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きたり",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "したり",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "したり",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ったり",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ったり",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ったり",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだり",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだり",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだり",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "かったり",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "のたもうたり",
            "kanaOut": "のたまう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いったり",
            "kanaOut": "いく",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "おうたり",
            "kanaOut": "おう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こうたり",
            "kanaOut": "こう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "そうたり",
            "kanaOut": "そう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とうたり",
            "kanaOut": "とう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "行ったり",
            "kanaOut": "行く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "逝ったり",
            "kanaOut": "逝く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "往ったり",
            "kanaOut": "往く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "請うたり",
            "kanaOut": "請う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "乞うたり",
            "kanaOut": "乞う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "恋うたり",
            "kanaOut": "恋う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "問うたり",
            "kanaOut": "問う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "負うたり",
            "kanaOut": "負う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "沿うたり",
            "kanaOut": "沿う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "添うたり",
            "kanaOut": "添う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "副うたり",
            "kanaOut": "副う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "厭うたり",
            "kanaOut": "厭う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-te": [
        {
            "kanaIn": "て",
            "kanaOut": "る",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いて",
            "kanaOut": "く",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いで",
            "kanaOut": "ぐ",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きて",
            "kanaOut": "くる",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "くて",
            "kanaOut": "い",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "して",
            "kanaOut": "す",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "して",
            "kanaOut": "する",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "って",
            "kanaOut": "う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "って",
            "kanaOut": "つ",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "って",
            "kanaOut": "る",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んで",
            "kanaOut": "ぬ",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んで",
            "kanaOut": "ぶ",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んで",
            "kanaOut": "む",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "のたもうて",
            "kanaOut": "のたまう",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いって",
            "kanaOut": "いく",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "おうて",
            "kanaOut": "おう",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こうて",
            "kanaOut": "こう",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "そうて",
            "kanaOut": "そう",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とうて",
            "kanaOut": "とう",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "行って",
            "kanaOut": "行く",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "逝って",
            "kanaOut": "逝く",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "往って",
            "kanaOut": "往く",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "請うて",
            "kanaOut": "請う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "乞うて",
            "kanaOut": "乞う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "恋うて",
            "kanaOut": "恋う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "問うて",
            "kanaOut": "問う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "負うて",
            "kanaOut": "負う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "沿うて",
            "kanaOut": "沿う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "添うて",
            "kanaOut": "添う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "副うて",
            "kanaOut": "副う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "厭うて",
            "kanaOut": "厭う",
            "rulesIn": [
                "iru"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-zu": [
        {
            "kanaIn": "ず",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "かず",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がず",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こず",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "さず",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "せず",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "たず",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なず",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばず",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "まず",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "らず",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "わず",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-nu": [
        {
            "kanaIn": "ぬ",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "かぬ",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がぬ",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こぬ",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "さぬ",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "せぬ",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "たぬ",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なぬ",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばぬ",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "まぬ",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "らぬ",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "わぬ",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "adv": [
        {
            "kanaIn": "く",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        }
    ],
    "causative": [
        {
            "kanaIn": "かせる",
            "kanaOut": "く",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がせる",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "させる",
            "kanaOut": "する",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "させる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "させる",
            "kanaOut": "す",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "たせる",
            "kanaOut": "つ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なせる",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばせる",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ませる",
            "kanaOut": "む",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "らせる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "わせる",
            "kanaOut": "う",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こさせる",
            "kanaOut": "くる",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vk"
            ]
        }
    ],
    "imperative": [
        {
            "kanaIn": "い",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "え",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "け",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "げ",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "せ",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "て",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ね",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "べ",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "め",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "よ",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "れ",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ろ",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "こい",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "しろ",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "せよ",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        }
    ],
    "imperative negative": [
        {
            "kanaIn": "な",
            "kanaOut": "",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "v5",
                "vk",
                "vs"
            ]
        }
    ],
    "masu stem": [
        {
            "kanaIn": "い",
            "kanaOut": "いる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "い",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "え",
            "kanaOut": "える",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "き",
            "kanaOut": "きる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "き",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "き",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎ",
            "kanaOut": "ぎる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "ぎ",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "け",
            "kanaOut": "ける",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "げ",
            "kanaOut": "げる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "し",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "じ",
            "kanaOut": "じる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "せ",
            "kanaOut": "せる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "ぜ",
            "kanaOut": "ぜる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "ち",
            "kanaOut": "ちる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "ち",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "て",
            "kanaOut": "てる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "で",
            "kanaOut": "でる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "に",
            "kanaOut": "にる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "に",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ね",
            "kanaOut": "ねる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "ひ",
            "kanaOut": "ひる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "び",
            "kanaOut": "びる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "び",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "へ",
            "kanaOut": "へる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "べ",
            "kanaOut": "べる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "み",
            "kanaOut": "みる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "み",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "め",
            "kanaOut": "める",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "り",
            "kanaOut": "りる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        },
        {
            "kanaIn": "り",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "れ",
            "kanaOut": "れる",
            "rulesIn": [],
            "rulesOut": [
                "v1"
            ]
        }
    ],
    "negative": [
        {
            "kanaIn": "ない",
            "kanaOut": "る",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "かない",
            "kanaOut": "く",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がない",
            "kanaOut": "ぐ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "くない",
            "kanaOut": "い",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "こない",
            "kanaOut": "くる",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "さない",
            "kanaOut": "す",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しない",
            "kanaOut": "する",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "たない",
            "kanaOut": "つ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なない",
            "kanaOut": "ぬ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばない",
            "kanaOut": "ぶ",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "まない",
            "kanaOut": "む",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "らない",
            "kanaOut": "る",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "わない",
            "kanaOut": "う",
            "rulesIn": [
                "adj-i"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "noun": [
        {
            "kanaIn": "さ",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        }
    ],
    "passive": [
        {
            "kanaIn": "かれる",
            "kanaOut": "く",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がれる",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "される",
            "kanaOut": "する",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "される",
            "kanaOut": "す",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "たれる",
            "kanaOut": "つ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なれる",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばれる",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "まれる",
            "kanaOut": "む",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "われる",
            "kanaOut": "う",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "られる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "past": [
        {
            "kanaIn": "た",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いた",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いだ",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きた",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "した",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "した",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "った",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "った",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "った",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだ",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだ",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んだ",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "かった",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        },
        {
            "kanaIn": "のたもうた",
            "kanaOut": "のたまう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いった",
            "kanaOut": "いく",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "おうた",
            "kanaOut": "おう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こうた",
            "kanaOut": "こう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "そうた",
            "kanaOut": "そう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とうた",
            "kanaOut": "とう",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "行った",
            "kanaOut": "行く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "逝った",
            "kanaOut": "逝く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "往った",
            "kanaOut": "往く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "請うた",
            "kanaOut": "請う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "乞うた",
            "kanaOut": "乞う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "恋うた",
            "kanaOut": "恋う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "問うた",
            "kanaOut": "問う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "負うた",
            "kanaOut": "負う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "沿うた",
            "kanaOut": "沿う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "添うた",
            "kanaOut": "添う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "副うた",
            "kanaOut": "副う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "厭うた",
            "kanaOut": "厭う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "polite": [
        {
            "kanaIn": "ます",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "います",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きます",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きます",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎます",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "します",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "します",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちます",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にます",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びます",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みます",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ります",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "polite negative": [
        {
            "kanaIn": "ません",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いません",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きません",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きません",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎません",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しません",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しません",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちません",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にません",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びません",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みません",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りません",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "くありません",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        }
    ],
    "polite past": [
        {
            "kanaIn": "ました",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いました",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きました",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きました",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎました",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しました",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しました",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちました",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にました",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びました",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みました",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りました",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "polite past negative": [
        {
            "kanaIn": "ませんでした",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いませんでした",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きませんでした",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きませんでした",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎませんでした",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しませんでした",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しませんでした",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちませんでした",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にませんでした",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びませんでした",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みませんでした",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りませんでした",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "くありませんでした",
            "kanaOut": "い",
            "rulesIn": [],
            "rulesOut": [
                "adj-i"
            ]
        }
    ],
    "polite volitional": [
        {
            "kanaIn": "ましょう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "いましょう",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きましょう",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きましょう",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "ぎましょう",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しましょう",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しましょう",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "ちましょう",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "にましょう",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "びましょう",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "みましょう",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "りましょう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "potential": [
        {
            "kanaIn": "える",
            "kanaOut": "う",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ける",
            "kanaOut": "く",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "げる",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "せる",
            "kanaOut": "す",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "てる",
            "kanaOut": "つ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ねる",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "べる",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "める",
            "kanaOut": "む",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "れる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v1",
                "v5",
                "vk"
            ]
        },
        {
            "kanaIn": "これる",
            "kanaOut": "くる",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vk"
            ]
        }
    ],
    "potential or passive": [
        {
            "kanaIn": "られる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "こられる",
            "kanaOut": "くる",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "vk"
            ]
        }
    ],
    "volitional": [
        {
            "kanaIn": "おう",
            "kanaOut": "う",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こう",
            "kanaOut": "く",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ごう",
            "kanaOut": "ぐ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "そう",
            "kanaOut": "す",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とう",
            "kanaOut": "つ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "のう",
            "kanaOut": "ぬ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ぼう",
            "kanaOut": "ぶ",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "もう",
            "kanaOut": "む",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "よう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v1",
                "vk"
            ]
        },
        {
            "kanaIn": "ろう",
            "kanaOut": "る",
            "rulesIn": [],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "こよう",
            "kanaOut": "くる",
            "rulesIn": [],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "しよう",
            "kanaOut": "する",
            "rulesIn": [],
            "rulesOut": [
                "vs"
            ]
        }
    ],
    "causative passive": [
        {
            "kanaIn": "かされる",
            "kanaOut": "く",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "がされる",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "たされる",
            "kanaOut": "つ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "なされる",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "ばされる",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "まされる",
            "kanaOut": "む",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "らされる",
            "kanaOut": "る",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "わされる",
            "kanaOut": "う",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "v5"
            ]
        }
    ],
    "-toku": [
        {
            "kanaIn": "いとく",
            "kanaOut": "く",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "いどく",
            "kanaOut": "ぐ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "きとく",
            "kanaOut": "くる",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "vk"
            ]
        },
        {
            "kanaIn": "しとく",
            "kanaOut": "す",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "しとく",
            "kanaOut": "する",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "vs"
            ]
        },
        {
            "kanaIn": "っとく",
            "kanaOut": "う",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "っとく",
            "kanaOut": "つ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "っとく",
            "kanaOut": "る",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んどく",
            "kanaOut": "ぬ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んどく",
            "kanaOut": "ぶ",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "んどく",
            "kanaOut": "む",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v5"
            ]
        },
        {
            "kanaIn": "とく",
            "kanaOut": "る",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "v1",
                "vk"
            ]
        }
    ],
    "progressive or perfect": [
        {
            "kanaIn": "ている",
            "kanaOut": "て",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "ておる",
            "kanaOut": "て",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "てる",
            "kanaOut": "て",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "でいる",
            "kanaOut": "で",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "でおる",
            "kanaOut": "で",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "とる",
            "kanaOut": "て",
            "rulesIn": [
                "v5"
            ],
            "rulesOut": [
                "iru"
            ]
        },
        {
            "kanaIn": "ないでいる",
            "kanaOut": "ない",
            "rulesIn": [
                "v1"
            ],
            "rulesOut": [
                "adj-i"
            ]
        }
    ]
};