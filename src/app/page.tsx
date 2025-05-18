
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RsvpForm } from '@/components/rsvp-form';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Heart, MapPin, Gift, Users, CalendarDays, Clock10, Cake, Palette, Banknote, Flower } from 'lucide-react';
import { getPhotoAlbumLink } from '@/services/google-sheets-service';


const timelineEvents = [
  {
    time: "13:30",
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Сбор гостей у ЗАГСа",
    description: "г. Краснодар, ул. Офицерская, 47. Просьба не опаздывать"
  },
  {
    time: "14:00",
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Свадебная церемония",
    description: "Может быть трогательно, разрешается всплакнуть"
  },
  {
    time: "16:00",
    icon: <Cake className="h-8 w-8 text-primary" />,
    title: "Торжественная часть",
    description: "Ресторан «Avrora Garden», г. Краснодар, ул. Дальняя 2/6. Самое время для вкусной еды, танцев и развлечений"
  },
  {
    time: "22:00",
    icon: <Clock10 className="h-8 w-8 text-primary" />,
    title: "Окончание вечера",
    description: "Надеемся, этот вечер вам понравится"
  }
];

const dressCodeColors = [
  { color: '#ebdbe8', name: 'Пыльно-розовый' },
  { color: '#aabccc', name: 'Пыльно-голубой' },
  { color: '#f2dfcc', name: 'Персиковый Нектар' },
  { color: '#cecbca', name: 'Серебряная Дымка' },
  { color: '#8d9f8c', name: 'Шалфейно-зеленый' },
];

export default async function WeddingInvitationPage() {
  const photoAlbumLink = await getPhotoAlbumLink();

  return (
    <>
      <main className="container mx-auto p-4">
 <TooltipProvider>

        <section className="my-12 sm:my-16 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 text-center lg:text-left">
          <ScrollReveal
            animationClassName="animate-fadeIn"
            delayClassName="animate-delay-200"
            className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-0 font-serif opacity-0"
            style={{ fontWeight: 100, fontSize: "clamp(3rem, 10vw, 6rem)" }}
          >
            <div className="line-height-1">03</div>
            <div className="text-3xl lg:text-5xl line-height-1 mx-1 lg:mx-0 lg:my-1" style={{ fontWeight: 200 }}>•</div>
            <div className="line-height-1">10</div>
            <div className="text-3xl lg:text-5xl line-height-1 mx-1 lg:mx-0 lg:my-1" style={{ fontWeight: 200 }}>•</div>
            <div className="line-height-1">25</div>
          </ScrollReveal>
          <div className="flex flex-col items-center justify-center lg:items-start">
            <ScrollReveal
              as="h1"
              animationClassName="animate-fadeInRight"
              delayClassName="animate-delay-800"
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-0"
            >
              Артём
            </ScrollReveal>
            <ScrollReveal
              animationClassName="animate-fadeIn"
              delayClassName="animate-delay-1000"
              className="text-4xl md:text-5xl my-2 font-serif opacity-0"
            >
              &
            </ScrollReveal>
            <ScrollReveal
              as="h1"
              animationClassName="animate-fadeInLeft"
              delayClassName="animate-delay-1200"
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-0"
            >
              Евгения
            </ScrollReveal>
            <ScrollReveal
              as="p"
              animationClassName="animate-fadeInUp"
              delayClassName="animate-delay-2000"
              className="mt-6 text-lg text-muted-foreground max-w-md font-sans opacity-0"
            >
              Мы будем рады разделить с Вами радость неповторимого для нас дня – дня нашей свадьбы!
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal animationClassName="animate-fadeIn" delayClassName="animate-delay-1200" className="my-12 sm:my-16 flex justify-center opacity-0">
          <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="https://img.freepik.com/free-photo/wedding-invitation-with-engagement-rings-top_23-2148474820.jpg?t=st=1746904374~exp=1746907974~hmac=2534af1a73727b956107333f47359e6919e147f1005995190459d53029ae2cb9&w=996"
              alt="Приглашение на свадьбу с кольцами"
              width={800}
              height={500}
              className="object-cover w-full h-full"
              data-ai-hint="wedding invitation rings"
              priority
            />
          </div>
        </ScrollReveal>

        <Separator className="my-12 sm:my-16" />

        <section id="program" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 opacity-0" >Программа дня</ScrollReveal>
          <ScrollReveal as="p" animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 flex items-center justify-center gap-2 font-sans opacity-0" >
            <CalendarDays className="h-5 sm:h-6 w-5 sm:w-6" /> Пятница, 3 октября 2025
          </ScrollReveal>
          <div className="relative flex flex-col items-center max-w-2xl mx-auto">
            {timelineEvents.map((event, index) => (
              <div key={index} className="w-full">
                <ScrollReveal
                  animationClassName="animate-fadeInUp"
                  delayClassName={`animate-delay-${200 * (index + 1)}`}
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 my-6 sm:my-8 w-full opacity-0"
                >
                  <div className="font-light text-2xl sm:text-3xl md:text-4xl tracking-wider w-full sm:w-1/4 text-center sm:text-right font-serif">{event.time}</div>
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary shadow-md">
                    <AvatarFallback className="flex items-center justify-center bg-transparent">
                      {event.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-3/4">
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl">{event.title}</h3>
                    <p className="text-muted-foreground mt-1 font-sans text-sm sm:text-base">{event.description}</p>
                  </div>
                </ScrollReveal>
                {index < timelineEvents.length - 1 && (
                  <ScrollReveal
                    animationClassName="animate-fadeIn"
                    delayClassName={`animate-delay-${200 * (index + 1) + 100}`}
                    className="vertical-line h-12 sm:h-16 md:h-24 mx-auto opacity-0"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12 sm:my-16" />

        <section id="location" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 opacity-0" >Локации</ScrollReveal>
          <ScrollReveal as="p" animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="text-md sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto font-sans opacity-0" >
            Два важных места в этот особенный день.
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <ScrollReveal animationClassName="animate-fadeInUp" delayClassName="animate-delay-400" className="opacity-0">
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-serif">ЗАГС «Екатерининский Зал»</CardTitle>
                  <CardDescription className="text-sm sm:text-md flex items-center justify-center gap-2 pt-2 font-sans">
                    <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-primary" /> г. Краснодар, ул. Офицерская, 47
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 sm:gap-6 flex-grow">
                  <div className="w-full h-56 sm:h-64 rounded-md overflow-hidden">
                    <Image
                      src="https://avatars.mds.yandex.net/get-altay/11400839/2a0000018c5e5f94ea6a91e1b49697c202c6/XXXL"
                      alt="ЗАГС Екатерининский Зал"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                      data-ai-hint="registry office interior"
                    />
                  </div>
                  <Button asChild variant="outline" className="font-sans mt-auto w-full text-sm sm:text-base">
                    <a href="https://yandex.ru/maps/?text=г. Краснодар, ул. Офицерская, 47" target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-2 h-4 w-4" /> Перейти на карту
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animationClassName="animate-fadeInUp" delayClassName="animate-delay-600" className="opacity-0">
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-serif">Ресторан «Avrora Garden»</CardTitle>
                  <CardDescription className="text-sm sm:text-md flex items-center justify-center gap-2 pt-2 font-sans">
                    <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-primary" /> г. Краснодар, ул. Дальняя 2/6
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 sm:gap-6 flex-grow">
                  <div className="w-full h-56 sm:h-64 rounded-md overflow-hidden">
                    <Image
                      src="https://avatars.mds.yandex.net/get-altay/760153/2a00000188195692f3245661594d57d7c947/XXXL"
                      alt="Ресторан Avrora Garden"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                      data-ai-hint="restaurant banquet hall"
                    />
                  </div>
                  <Button asChild variant="outline" className="font-sans mt-auto w-full text-sm sm:text-base">
                    <a href="https://yandex.ru/maps/?text=г. Краснодар, ул. Дальняя 2/6" target="_blank" rel="noopener noreferrer">
                      <MapPin className="mr-2 h-4 w-4" /> Перейти на карту
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        <Separator className="my-12 sm:my-16" />

        <section id="rsvp" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 opacity-0" >Ваше присутствие</ScrollReveal>
          <ScrollReveal as="p" animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="text-md sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto font-sans opacity-0" >
            Будем очень рады видеть Вас! Просим подтвердить свое присутствие на торжестве до 1 июля 2025 г.
          </ScrollReveal>
          <ScrollReveal animationClassName="animate-fadeInUp" delayClassName="animate-delay-400" className="opacity-0">
            <Card className="max-w-md mx-auto shadow-lg">
              <CardContent className="pt-6">
                <RsvpForm />
              </CardContent>
            </Card>
          </ScrollReveal>
        </section>

        <Separator className="my-12 sm:my-16" />

        <section id="wishes" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-10 sm:mb-12 opacity-0" >Наши пожелания</ScrollReveal>
          <ScrollReveal animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="max-w-xl mx-auto space-y-6 text-md sm:text-lg text-muted-foreground font-sans opacity-0" >
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4 text-center sm:text-left">
              <Heart className="h-6 w-6 text-primary mt-1 shrink-0 mx-auto sm:mx-0" />
              <p>Будем благодарны, если Вы воздержитесь от криков «Горько» на празднике, ведь поцелуй - знак выражения чувств, он не может быть по заказу.</p>
            </div>
             <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4 text-center sm:text-left">
              <Gift className="h-6 w-6 text-primary mt-1 shrink-0 mx-auto sm:mx-0" />
              <p>Если у Вас творческий подарок, просим предупредить организатора Дмитрия заранее: <a href="https://t.me/d_sotskiy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline whitespace-nowrap">@d_sotskiy (Телеграмм)</a>.</p>
            </div>
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4 text-center sm:text-left">
              <Banknote className="h-6 w-6 text-primary mt-1 shrink-0 mx-auto sm:mx-0" />
              <p>Самый лучший подарок для нас - это ваше присутствие, но если вы хотите сделать нам подарок, мы будем рады вкладу в наш семейный бюджет.</p>
            </div>
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4 text-center sm:text-left">
              <Flower className="h-6 w-6 text-primary mt-1 shrink-0 mx-auto sm:mx-0" />
              <p>А вот от букетов, пожалуйста, воздержитесь — нам будет сложно сохранить их в праздничной суете.</p>
            </div>
          </ScrollReveal>
        </section>

        <Separator className="my-12 sm:my-16" />

        <section id="dress-code" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 opacity-0" >Дресс-код</ScrollReveal>
          <ScrollReveal as="p" animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="text-md sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto font-sans opacity-0" >
            Вы будете украшением вечера, если придете в одежде. Стиль и классические костюмы не важны, главное выглядеть аккуратно и уверенно.
          </ScrollReveal>
          {/* <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {dressCodeColors.map((item, index) => (
              <ScrollReveal
                key={index}
                animationClassName="animate-fadeInUp"
                delayClassName={`animate-delay-${100 * (index + 1)}`}
                className="flex flex-col items-center opacity-0"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar
                  className="h-14 w-14 sm:h-16 sm:w-20 md:h-20 md:w-20 border-2 border-background shadow-md"
                  style={{ backgroundColor: item.color }}
                >
                      <AvatarFallback className="flex items-center justify-center bg-transparent">
                        <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-50"/>
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-sans">{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </ScrollReveal>
            ))}
          </div> */}
        </section>

        <Separator className="my-12 sm:my-16" />

        <section id="photo-album" className="my-12 sm:my-16 text-center">
          <ScrollReveal as="h2" animationClassName="animate-fadeInUp" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 opacity-0" >Фотоотчет</ScrollReveal>
          <ScrollReveal as="p" animationClassName="animate-fadeInUp" delayClassName="animate-delay-200" className="text-md sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto font-sans opacity-0" >
            {photoAlbumLink ? (
              <Button asChild className="font-sans text-sm sm:text-base">
                <a href={photoAlbumLink} target="_blank" rel="noopener noreferrer">
                  Перейти в фотоальбом
                </a>
              </Button>
            ) : (
              <Button className="font-sans text-sm sm:text-base" disabled>
                Фото будут тут после мероприятия
              </Button>
            )}
          </ScrollReveal>
        </section>

        <Separator className="my-12 sm:my-16" />

        <ScrollReveal animationClassName="animate-fadeIn" delayClassName="animate-delay-200" className="my-12 sm:my-16 flex justify-center opacity-0" >
           <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="https://img.freepik.com/free-photo/top-view-wedding-flowers-with-copy-space_23-2148461242.jpg?t=st=1746904488~exp=1746908088~hmac=39001b5d16d93d27df8fad9a52a831272de485d09f7c96a7f52d3a29395591f1&w=996"
              alt="Свадебные цветы"
              width={800}
              height={500}
              className="object-cover w-full h-full"
              data-ai-hint="wedding flowers flatlay"
            />
          </div>
        </ScrollReveal>

        <section className="my-16 sm:my-20 text-center">
          <ScrollReveal
            as="h2"
            animationClassName="animate-fadeInUp"
            delayClassName="animate-delay-200"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif opacity-0"
          >
            До встречи!
          </ScrollReveal>
        </section>
 </TooltipProvider>
      </main>
      <footer className="pb-8 sm:pb-12 text-center text-muted-foreground font-sans text-sm">
        <p><a href="https://unlim-creative-studio.ru/" target="_blank" rel="noopener noreferrer">&copy; {new Date().getFullYear()} Создано Артёмом и Евгенией. С любовью.</a></p>
        <p className="mt-2 text-xs">
          Этот сайт защищен reCAPTCHA, и применяются{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Политика конфиденциальности
          </a>{' '}
          и{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Условия использования
          </a>{' '}
          Google.
        </p>
      </footer>
    </>
  );
}

    