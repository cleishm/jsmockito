Changed in 1.0.4 (2011-08-16)
=============================

Various bugfixes:
- An issue where last stubbing was not preferred
  (reported by Volodymyr Mykhailyk,
   https://github.com/chrisleishman/jsmockito/issues/1)
- An issue where mocked Arrays could not be validated with bulk validators
  (reported by 'HitmanInWis',
   https://github.com/chrisleishman/jsmockito/issues/5)
- An issue where 'thenReturn' and 'thenThrow' stubs where not chaining
  (reported by 'HitmanInWis',
   https://github.com/chrisleishman/jsmockito/issues/6)

Changed in 1.0.3 (2011-02-21)
=============================

Added jSpec integration and support for spying on constructors (courtesy of Ben Cherry https://github.com/bcherry).

Changed in 1.0.2 (2010-01-21)
=============================

Added additional documentation and the verifyNoMoreInteractions(mock) feature

Changed in 1.0.1 (2009-09-11)
=============================

Bugfix: Fixed IE issue affecting verification failure messages

Changed in 1.0.0 (2009-09-10)
=============================

Initial release
