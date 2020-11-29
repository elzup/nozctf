
import random, string, time

dt = 0.000001

st = time.time() - 1
# rand_s = ''.join(random.choices(string.ascii_letters, k=6))
rand_s = random.randint(1, 10000000)
et = time.time()

while st < et:
  random.seed(st * 256)
  # r = ''.join(random.choices(string.ascii_letters, k=6))
  r = random.randint(1, 10000000)
  # print(st, et)
  time.sleep(0.1)
  if rand_s == r:
    print(rand_s)
    print(st)
    break
  st += dt
