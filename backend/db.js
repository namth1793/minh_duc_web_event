const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'event.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    excerpt_vi TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_vi TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    department_en TEXT NOT NULL,
    department_vi TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_vi TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    event_date TEXT,
    attendees TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS event_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    event_date TEXT,
    guests TEXT,
    info TEXT,
    newsletter INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS career_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    job_id INTEGER,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content_en TEXT,
    content_vi TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, section)
  );

  CREATE TABLE IF NOT EXISTS site_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    label TEXT,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );
`);

// Seed blog posts
const blogCount = db.prepare('SELECT COUNT(*) as cnt FROM blog_posts').get();
if (blogCount.cnt === 0) {
  const insertBlog = db.prepare(`
    INSERT INTO blog_posts (title_en, title_vi, category, date, thumbnail, excerpt_en, excerpt_vi, content_en, content_vi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const blogs = [
    {
      title_en: 'Creating the Perfect Wedding at Minh Đức Events',
      title_vi: 'Tạo Nên Đám Cưới Hoàn Hảo Tại Minh Đức Events',
      category: 'Events',
      date: '2025-12-15',
      thumbnail: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
      excerpt_en: 'Discover how our dedicated team transforms your wedding vision into an unforgettable reality, from intimate ceremonies to grand celebrations.',
      excerpt_vi: 'Khám phá cách đội ngũ tận tâm của chúng tôi biến tầm nhìn đám cưới của bạn thành hiện thực không thể quên, từ những buổi lễ thân mật đến các buổi tiệc lớn.',
      content_en: `<p>At Minh Đức Events, we believe every wedding is a unique love story waiting to be told. Our experienced team of event planners, florists, and hospitality professionals work tirelessly to craft ceremonies and receptions that perfectly reflect the couple's personality and vision.</p>
<h2>The Art of Personalization</h2>
<p>From the very first consultation, we take the time to understand what makes your relationship special. Whether you envision an intimate garden ceremony for fifty guests or a grand ballroom celebration for five hundred, our versatile venue spaces can accommodate your dream.</p>
<p>Our design team curates every detail — from centerpiece florals that complement your chosen color palette to custom lighting arrangements that create the perfect romantic ambiance as the sun sets over our manicured gardens.</p>
<h2>Culinary Excellence</h2>
<p>Our award-winning culinary team offers bespoke menu creation for every wedding. Whether you prefer a classic Vietnamese banquet, a modern fusion menu, or a sophisticated Western dinner service, our chefs bring exceptional skill and passion to every dish.</p>
<p>Couples are invited to attend private tasting sessions where they can sample and refine their wedding menu, ensuring every flavor exceeds expectations on the big day.</p>
<h2>Seamless Coordination</h2>
<p>Your dedicated wedding coordinator will be by your side from planning to the final dance, ensuring every moment unfolds flawlessly. We understand that weddings are one of life's most significant milestones, and we treat each event with the reverence and attention it deserves.</p>`,
      content_vi: `<p>Tại Minh Đức Events, chúng tôi tin rằng mỗi đám cưới là một câu chuyện tình yêu độc đáo đang chờ được kể. Đội ngũ chuyên gia tổ chức sự kiện, nghệ nhân cắm hoa và nhân viên khách sạn giàu kinh nghiệm của chúng tôi làm việc không ngừng nghỉ để tạo ra các buổi lễ và tiệc tiếp tân phản ánh hoàn hảo cá tính và tầm nhìn của cặp đôi.</p>
<h2>Nghệ Thuật Cá Nhân Hóa</h2>
<p>Ngay từ buổi tư vấn đầu tiên, chúng tôi dành thời gian tìm hiểu điều gì làm cho mối quan hệ của bạn trở nên đặc biệt. Dù bạn hình dung một buổi lễ vườn thân mật cho năm mươi khách hay một buổi tiệc phòng khiêu vũ lớn cho năm trăm người, không gian tổ chức sự kiện đa dạng của chúng tôi có thể đáp ứng giấc mơ của bạn.</p>
<p>Đội ngũ thiết kế của chúng tôi chăm chút từng chi tiết — từ hoa trang trí bàn bổ sung bảng màu bạn chọn đến bố trí ánh sáng tùy chỉnh tạo ra không khí lãng mạn hoàn hảo khi mặt trời lặn trên những khu vườn được chăm sóc kỹ lưỡng của chúng tôi.</p>
<h2>Ẩm Thực Xuất Sắc</h2>
<p>Đội ngũ ẩm thực từng đoạt giải thưởng của chúng tôi cung cấp thực đơn tùy chỉnh cho mỗi đám cưới. Dù bạn thích tiệc cưới Việt Nam truyền thống, thực đơn fusion hiện đại hay dịch vụ tối phương Tây tinh tế, các đầu bếp của chúng tôi mang đến kỹ năng và niềm đam mê đặc biệt cho mỗi món ăn.</p>
<p>Các cặp đôi được mời tham dự các buổi nếm thử riêng tư để có thể thưởng thức và hoàn thiện thực đơn tiệc cưới, đảm bảo mọi hương vị đều vượt quá mong đợi vào ngày trọng đại.</p>
<h2>Điều Phối Liền Mạch</h2>
<p>Người điều phối đám cưới chuyên trách của bạn sẽ đồng hành từ lúc lên kế hoạch đến điệu nhảy cuối cùng, đảm bảo mọi khoảnh khắc diễn ra hoàn hảo. Chúng tôi hiểu rằng đám cưới là một trong những cột mốc quan trọng nhất trong cuộc đời và chúng tôi đối xử với mỗi sự kiện với sự tôn trọng và chú ý xứng đáng.</p>`
    },
    {
      title_en: 'Top Trends in Corporate Event Planning for 2025',
      title_vi: 'Xu Hướng Hàng Đầu Trong Tổ Chức Sự Kiện Doanh Nghiệp 2025',
      category: 'Corporate Events',
      date: '2025-11-20',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      excerpt_en: 'As businesses evolve, so do their event needs. Explore the latest trends shaping corporate gatherings in 2025.',
      excerpt_vi: 'Khi doanh nghiệp phát triển, nhu cầu sự kiện cũng thay đổi. Khám phá những xu hướng mới nhất định hình các buổi họp doanh nghiệp năm 2025.',
      content_en: `<p>The corporate events landscape is undergoing a dramatic transformation. In 2025, companies are no longer satisfied with standard conference rooms and generic catering — they demand immersive, purposeful experiences that align with their brand values and motivate their teams.</p>
<h2>Sustainability as Standard</h2>
<p>Green events are no longer optional. Corporate clients are increasingly requesting zero-waste catering, locally sourced menus, and digital-first event materials. At Minh Đức Events, our sustainable event packages minimize environmental impact while maximizing the guest experience.</p>
<h2>Hybrid Event Integration</h2>
<p>The post-pandemic world has normalized hybrid formats. We've invested in state-of-the-art AV infrastructure that allows seamless integration between in-person and virtual attendees, ensuring your remote team feels as engaged as those in the room.</p>
<h2>Wellness-Focused Programming</h2>
<p>Forward-thinking companies are incorporating wellness elements — morning yoga sessions, mindfulness breaks, healthy catering options — to support employee wellbeing and productivity during multi-day conferences.</p>
<h2>Personalized Attendee Journeys</h2>
<p>Technology enables unprecedented personalization. From custom welcome messages to curated breakout session recommendations, modern corporate events treat each attendee as an individual rather than a number.</p>`,
      content_vi: `<p>Bức tranh sự kiện doanh nghiệp đang trải qua sự chuyển đổi mạnh mẽ. Năm 2025, các công ty không còn hài lòng với phòng hội nghị tiêu chuẩn và dịch vụ ăn uống thông thường — họ đòi hỏi những trải nghiệm đắm chìm, có mục đích phù hợp với giá trị thương hiệu và truyền cảm hứng cho đội ngũ của họ.</p>
<h2>Bền Vững Như Tiêu Chuẩn</h2>
<p>Sự kiện xanh không còn là tùy chọn nữa. Khách hàng doanh nghiệp ngày càng yêu cầu phục vụ ăn uống không rác thải, thực đơn từ nguồn địa phương và tài liệu sự kiện ưu tiên kỹ thuật số. Tại Minh Đức Events, các gói sự kiện bền vững của chúng tôi giảm thiểu tác động môi trường trong khi tối đa hóa trải nghiệm của khách.</p>
<h2>Tích Hợp Sự Kiện Hybrid</h2>
<p>Thế giới hậu đại dịch đã bình thường hóa các định dạng hybrid. Chúng tôi đã đầu tư vào cơ sở hạ tầng AV tiên tiến cho phép tích hợp liền mạch giữa người tham dự trực tiếp và trực tuyến, đảm bảo đội ngũ làm việc từ xa của bạn cảm thấy gắn kết như những người trong phòng.</p>
<h2>Chương Trình Tập Trung Vào Sức Khỏe</h2>
<p>Các công ty có tầm nhìn xa đang kết hợp các yếu tố sức khỏe — buổi yoga buổi sáng, giải lao chánh niệm, lựa chọn ăn uống lành mạnh — để hỗ trợ sức khỏe và năng suất của nhân viên trong các hội nghị nhiều ngày.</p>
<h2>Hành Trình Cá Nhân Hóa Cho Người Tham Dự</h2>
<p>Công nghệ cho phép cá nhân hóa chưa từng có. Từ tin nhắn chào mừng tùy chỉnh đến các đề xuất phiên thảo luận nhóm được tuyển chọn, các sự kiện doanh nghiệp hiện đại đối xử với mỗi người tham dự như một cá nhân chứ không phải một con số.</p>`
    },
    {
      title_en: 'Minh Đức Events Wins Best Venue Award 2025',
      title_vi: 'Minh Đức Events Giành Giải Thưởng Địa Điểm Tốt Nhất 2025',
      category: 'News',
      date: '2025-10-05',
      thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      excerpt_en: 'We are thrilled to announce that Minh Đức Events has been honored with the prestigious Best Event Venue award at the Vietnam Hospitality Excellence Awards 2025.',
      excerpt_vi: 'Chúng tôi vô cùng vui mừng thông báo rằng Minh Đức Events đã được vinh danh với giải thưởng Địa Điểm Sự Kiện Tốt Nhất danh giá tại Giải Thưởng Xuất Sắc Khách Sạn Việt Nam 2025.',
      content_en: `<p>We are immensely proud to share that Minh Đức Events has been awarded the Best Event Venue at the prestigious Vietnam Hospitality Excellence Awards 2025, held at the Grand Palace Hotel in Hanoi.</p>
<h2>A Testament to Our Team</h2>
<p>This recognition belongs to every member of our extraordinary team — from our passionate event coordinators and talented chefs to our meticulous housekeeping staff and warm front-of-house professionals. Together, they deliver world-class experiences day after day.</p>
<h2>What the Judges Said</h2>
<p>The judging panel praised Minh Đức Events for our "exceptional attention to detail, innovative approach to event design, and consistently outstanding client feedback." They noted our seamless integration of traditional Vietnamese hospitality values with contemporary luxury standards.</p>
<h2>Looking Forward</h2>
<p>This award motivates us to push even further. We have exciting expansions planned for 2026, including a new outdoor pavilion, an enhanced culinary program, and a dedicated pre-wedding photography garden. We look forward to welcoming you to experience these new additions.</p>
<p>Thank you to all our clients who trusted us with their most precious moments. You are the reason we do what we do.</p>`,
      content_vi: `<p>Chúng tôi vô cùng tự hào chia sẻ rằng Minh Đức Events đã được trao giải Địa Điểm Sự Kiện Tốt Nhất tại Giải Thưởng Xuất Sắc Khách Sạn Việt Nam 2025 danh giá, được tổ chức tại Khách Sạn Grand Palace ở Hà Nội.</p>
<h2>Minh Chứng Cho Đội Ngũ Của Chúng Tôi</h2>
<p>Sự công nhận này thuộc về mọi thành viên trong đội ngũ phi thường của chúng tôi — từ các điều phối viên sự kiện đầy nhiệt huyết và đầu bếp tài năng đến nhân viên dọn phòng tỉ mỉ và nhân viên phục vụ khách ấm áp. Cùng nhau, họ mang lại những trải nghiệm đẳng cấp thế giới mỗi ngày.</p>
<h2>Ban Giám Khảo Nói Gì</h2>
<p>Ban giám khảo đã khen ngợi Minh Đức Events vì "sự chú ý đến chi tiết đặc biệt, cách tiếp cận sáng tạo trong thiết kế sự kiện và phản hồi khách hàng xuất sắc liên tục." Họ lưu ý sự tích hợp liền mạch của các giá trị hiếu khách truyền thống Việt Nam với các tiêu chuẩn sang trọng hiện đại.</p>
<h2>Nhìn Về Phía Trước</h2>
<p>Giải thưởng này thôi thúc chúng tôi tiến xa hơn nữa. Chúng tôi có kế hoạch mở rộng thú vị cho năm 2026, bao gồm một nhà pavilion ngoài trời mới, chương trình ẩm thực nâng cao và khu vườn chụp ảnh trước đám cưới chuyên dụng. Chúng tôi mong muốn được chào đón bạn để trải nghiệm những bổ sung mới này.</p>
<p>Cảm ơn tất cả khách hàng đã tin tưởng giao phó cho chúng tôi những khoảnh khắc quý giá nhất của họ. Các bạn là lý do chúng tôi làm những gì chúng tôi làm.</p>`
    },
    {
      title_en: 'Designing Our Garden Pavilion: A Space Born from Nature',
      title_vi: 'Thiết Kế Nhà Pavilion Vườn: Không Gian Sinh Ra Từ Thiên Nhiên',
      category: 'Venue Space',
      date: '2025-09-18',
      thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
      excerpt_en: 'Our newest outdoor pavilion space was designed with one philosophy: let the beauty of nature be the primary decoration.',
      excerpt_vi: 'Không gian nhà pavilion ngoài trời mới nhất của chúng tôi được thiết kế với một triết lý: để vẻ đẹp của thiên nhiên là trang trí chính.',
      content_en: `<p>When we began designing our Garden Pavilion, we started with a single question: what if the venue itself was the artwork? Inspired by the natural beauty of Vietnam's central highlands and the lush tropical landscape surrounding our property, we set out to create a space where the boundary between indoors and outdoors dissolves entirely.</p>
<h2>Architectural Vision</h2>
<p>The pavilion features soaring glass walls that frame panoramic views of our manicured gardens. Local bamboo and sustainable hardwoods were used throughout the construction, paying homage to Vietnamese craftsmanship while meeting international luxury standards.</p>
<h2>The Living Garden</h2>
<p>Working with leading landscape architects, we cultivated a living garden that changes with the seasons. Native orchids, jasmine, and tropical ferns create a fragrant, ever-evolving backdrop for ceremonies and celebrations. At night, carefully positioned uplighting transforms the garden into a magical, otherworldly landscape.</p>
<h2>Technical Excellence</h2>
<p>Behind the natural beauty lies sophisticated technical infrastructure — retractable glass panels for climate control, a discreet sound system embedded in the landscape, and programmable LED lighting integrated into the garden features.</p>
<p>The Garden Pavilion accommodates up to 200 guests for seated dinners and 350 for standing receptions. It is available exclusively for private bookings.</p>`,
      content_vi: `<p>Khi bắt đầu thiết kế Nhà Pavilion Vườn, chúng tôi bắt đầu với một câu hỏi duy nhất: điều gì sẽ xảy ra nếu chính địa điểm là tác phẩm nghệ thuật? Lấy cảm hứng từ vẻ đẹp tự nhiên của vùng cao nguyên miền Trung Việt Nam và cảnh quan nhiệt đới tươi tốt bao quanh tài sản của chúng tôi, chúng tôi đặt ra để tạo ra một không gian nơi ranh giới giữa trong nhà và ngoài trời tan biến hoàn toàn.</p>
<h2>Tầm Nhìn Kiến Trúc</h2>
<p>Nhà pavilion có những bức tường kính cao chót vót bao khung cảnh toàn cảnh của những khu vườn được chăm sóc kỹ lưỡng của chúng tôi. Tre địa phương và gỗ cứng bền vững được sử dụng xuyên suốt quá trình xây dựng, tôn vinh tay nghề thủ công Việt Nam trong khi đáp ứng các tiêu chuẩn sang trọng quốc tế.</p>
<h2>Khu Vườn Sống</h2>
<p>Làm việc với các kiến trúc sư cảnh quan hàng đầu, chúng tôi đã vun trồng một khu vườn sống thay đổi theo mùa. Phong lan bản địa, nhài và dương xỉ nhiệt đới tạo ra một phông nền thơm ngát, luôn thay đổi cho các buổi lễ và lễ kỷ niệm. Vào ban đêm, ánh sáng chiếu từ dưới lên được định vị cẩn thận biến khu vườn thành một cảnh quan huyền ảo, siêu thực.</p>
<h2>Xuất Sắc Kỹ Thuật</h2>
<p>Phía sau vẻ đẹp tự nhiên là cơ sở hạ tầng kỹ thuật tinh vi — các tấm kính thu vào để kiểm soát khí hậu, hệ thống âm thanh kín đáo được nhúng vào cảnh quan và đèn LED có thể lập trình được tích hợp vào các tính năng vườn.</p>
<p>Nhà Pavilion Vườn chứa tối đa 200 khách cho bữa tối ngồi và 350 cho tiệc đứng. Có sẵn dành riêng cho đặt phòng riêng tư.</p>`
    },
    {
      title_en: 'Planning the Ultimate Year-End Party for Your Company',
      title_vi: 'Lên Kế Hoạch Tiệc Cuối Năm Hoàn Hảo Cho Công Ty Bạn',
      category: 'Year End Party',
      date: '2025-08-30',
      thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      excerpt_en: 'Year-end parties are more than celebrations — they are powerful moments to recognize achievements, strengthen bonds, and inspire the team for the year ahead.',
      excerpt_vi: 'Tiệc cuối năm không chỉ là lễ kỷ niệm — đó là những khoảnh khắc mạnh mẽ để ghi nhận thành tích, củng cố mối quan hệ và truyền cảm hứng cho đội ngũ cho năm sắp tới.',
      content_en: `<p>As the calendar year draws to a close, companies across Vietnam look to celebrate their achievements and thank their teams for a year of hard work. At Minh Đức Events, we have hosted hundreds of year-end parties ranging from intimate team dinners to spectacular gala evenings for thousands of guests.</p>
<h2>Setting the Right Tone</h2>
<p>The theme of your year-end party should reflect your company's journey throughout the year. Whether it's a forward-looking "New Horizons" theme or a celebratory "Year of Achievement," our creative team will help you develop a concept that resonates with your employees and brings your company culture to life.</p>
<h2>Entertainment That Inspires</h2>
<p>From live music performances by Vietnam's top artists to immersive theatrical experiences and interactive team challenges, we curate entertainment programs that create genuine excitement and lasting memories. Our relationships with leading entertainers ensure exclusive acts that your team will talk about for years to come.</p>
<h2>Awards and Recognition Ceremonies</h2>
<p>We design bespoke awards ceremonies that make your top performers feel genuinely celebrated. Custom trophies, personalized video tributes, and professionally produced highlight reels transform a simple recognition segment into a deeply moving experience.</p>
<h2>Culinary Journeys</h2>
<p>Our year-end party menus are crafted to impress — from elegant plated dinners to interactive food stations showcasing the best of Vietnamese and international cuisine. Our beverage programs featuring premium cocktails and fine wines ensure the celebrations flow seamlessly from the first toast to the final dance.</p>`,
      content_vi: `<p>Khi năm dương lịch sắp kết thúc, các công ty trên khắp Việt Nam tìm cách ăn mừng thành tích và cảm ơn đội ngũ vì một năm làm việc chăm chỉ. Tại Minh Đức Events, chúng tôi đã tổ chức hàng trăm bữa tiệc cuối năm từ những bữa tối nhóm thân mật đến những buổi dạ tiệc ngoạn mục cho hàng nghìn khách.</p>
<h2>Thiết Lập Tông Điệu Phù Hợp</h2>
<p>Chủ đề tiệc cuối năm của bạn nên phản ánh hành trình của công ty trong suốt năm. Dù đó là chủ đề "Chân Trời Mới" hướng về tương lai hay "Năm Thành Tựu" kỷ niệm, đội ngũ sáng tạo của chúng tôi sẽ giúp bạn phát triển một khái niệm phù hợp với nhân viên và đưa văn hóa công ty vào cuộc sống.</p>
<h2>Giải Trí Truyền Cảm Hứng</h2>
<p>Từ các buổi biểu diễn âm nhạc sống của các nghệ sĩ hàng đầu Việt Nam đến các trải nghiệm sân khấu đắm chìm và thách thức đội nhóm tương tác, chúng tôi tuyển chọn các chương trình giải trí tạo ra sự phấn khích thực sự và kỷ niệm lâu dài. Mối quan hệ của chúng tôi với các nghệ sĩ giải trí hàng đầu đảm bảo các tiết mục độc quyền mà đội ngũ của bạn sẽ nói đến trong nhiều năm tới.</p>
<h2>Lễ Trao Giải và Ghi Nhận</h2>
<p>Chúng tôi thiết kế các lễ trao giải đặc biệt khiến những người thực hiện hàng đầu của bạn cảm thấy thực sự được tôn vinh. Cúp tùy chỉnh, video tri ân cá nhân hóa và các đoạn phim nổi bật được sản xuất chuyên nghiệp biến một phần ghi nhận đơn giản thành một trải nghiệm xúc động sâu sắc.</p>
<h2>Hành Trình Ẩm Thực</h2>
<p>Thực đơn tiệc cuối năm của chúng tôi được chế tạo để gây ấn tượng — từ những bữa tối phục vụ theo đĩa sang trọng đến các quầy thức ăn tương tác trưng bày những gì tốt nhất của ẩm thực Việt Nam và quốc tế. Các chương trình đồ uống của chúng tôi với cocktail cao cấp và rượu vang hảo hạng đảm bảo các buổi lễ kỷ niệm diễn ra suôn sẻ từ ly rượu chúc mừng đầu tiên đến điệu nhảy cuối cùng.</p>`
    },
    {
      title_en: 'The Art of Intimate Dining: Private Dinner Experiences',
      title_vi: 'Nghệ Thuật Ăn Tối Thân Mật: Trải Nghiệm Bữa Tối Riêng Tư',
      category: 'Events',
      date: '2025-07-12',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      excerpt_en: 'In an era of grand spectacles, there is a growing appreciation for the exquisite intimacy of a perfectly curated private dinner experience.',
      excerpt_vi: 'Trong thời đại của những màn trình diễn hoành tráng, ngày càng có nhiều người trân trọng sự thân mật tuyệt vời của trải nghiệm bữa tối riêng tư được tuyển chọn hoàn hảo.',
      content_en: `<p>There is something profoundly special about a private dining experience — a space created entirely for you and your guests, where every detail has been thoughtfully considered and every moment feels like a gift. At Minh Đức Events, our private dining offerings represent the pinnacle of our hospitality philosophy.</p>
<h2>Our Private Dining Spaces</h2>
<p>We offer three distinct private dining rooms, each with its own character and capacity. The Jasmine Room (up to 20 guests) features floor-to-ceiling windows overlooking the rose garden. The Heritage Room (up to 50 guests) celebrates traditional Vietnamese artistry with silk panels and lacquerware accents. The Terrace Suite (up to 80 guests) offers open-air dining beneath the stars with dramatic city views.</p>
<h2>Bespoke Menu Creation</h2>
<p>Each private dinner begins with a personal consultation with our Executive Chef. Together, you'll craft a menu that tells a story — your story. Perhaps incorporating dishes from regions significant to your family history, wines from a vintage year that holds personal meaning, or a dessert that recreates a cherished childhood memory.</p>
<h2>The Perfect Setting</h2>
<p>Our floristry and styling team creates unique tablescapes for each private dining event. No two tables are ever identical at Minh Đức Events. From hand-gathered wildflower arrangements to sculptural candelabras and custom-printed menus, every visual element contributes to an atmosphere of refined elegance.</p>
<h2>Occasions Perfect for Private Dining</h2>
<p>Birthday milestones, anniversary celebrations, engagement proposals, family reunions, client entertainment — private dining at Minh Đức Events elevates any occasion into an extraordinary memory.</p>`,
      content_vi: `<p>Có điều gì đó đặc biệt sâu sắc về trải nghiệm ăn tối riêng tư — một không gian được tạo ra hoàn toàn cho bạn và khách của bạn, nơi mọi chi tiết đã được suy nghĩ kỹ lưỡng và mọi khoảnh khắc đều cảm thấy như một món quà. Tại Minh Đức Events, các ưu đãi ăn tối riêng tư của chúng tôi đại diện cho đỉnh cao của triết lý hiếu khách.</p>
<h2>Không Gian Ăn Tối Riêng Tư Của Chúng Tôi</h2>
<p>Chúng tôi cung cấp ba phòng ăn tối riêng tư khác biệt, mỗi phòng có đặc điểm và sức chứa riêng. Phòng Hoa Nhài (tối đa 20 khách) có cửa sổ từ sàn đến trần nhìn ra vườn hoa hồng. Phòng Di Sản (tối đa 50 khách) tôn vinh nghệ thuật truyền thống Việt Nam với các tấm lụa và điểm nhấn đồ sơn mài. Suite Sân Thượng (tối đa 80 khách) cung cấp bữa ăn ngoài trời dưới những vì sao với tầm nhìn thành phố ấn tượng.</p>
<h2>Tạo Thực Đơn Đặc Biệt</h2>
<p>Mỗi bữa tối riêng tư bắt đầu bằng buổi tư vấn cá nhân với Bếp Trưởng Điều Hành của chúng tôi. Cùng nhau, bạn sẽ tạo ra một thực đơn kể một câu chuyện — câu chuyện của bạn. Có thể kết hợp các món ăn từ các vùng quan trọng với lịch sử gia đình bạn, rượu vang từ năm thu hoạch có ý nghĩa cá nhân, hoặc món tráng miệng tái hiện ký ức tuổi thơ quý giá.</p>
<h2>Bối Cảnh Hoàn Hảo</h2>
<p>Đội ngũ cắm hoa và tạo phong cách của chúng tôi tạo ra những bàn ăn độc đáo cho mỗi sự kiện ăn tối riêng tư. Không có hai bàn ăn nào giống nhau tại Minh Đức Events. Từ những bó hoa dại hái bằng tay đến đèn nến điêu khắc và thực đơn in tùy chỉnh, mọi yếu tố hình ảnh đều góp phần tạo nên bầu không khí sang trọng tinh tế.</p>
<h2>Các Dịp Hoàn Hảo Cho Bữa Tối Riêng Tư</h2>
<p>Cột mốc sinh nhật, kỷ niệm ngày cưới, cầu hôn, họp mặt gia đình, tiếp khách — ăn tối riêng tư tại Minh Đức Events nâng bất kỳ dịp nào lên thành ký ức phi thường.</p>`
    }
  ];

  const insertMany = db.transaction((posts) => {
    for (const post of posts) {
      insertBlog.run(
        post.title_en, post.title_vi, post.category, post.date,
        post.thumbnail, post.excerpt_en, post.excerpt_vi,
        post.content_en, post.content_vi
      );
    }
  });
  insertMany(blogs);
}

// Seed careers
const careerCount = db.prepare('SELECT COUNT(*) as cnt FROM careers').get();
if (careerCount.cnt === 0) {
  const insertCareer = db.prepare(`
    INSERT INTO careers (title_en, title_vi, department_en, department_vi, description_en, description_vi, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const jobs = [
    {
      title_en: 'Senior Event Coordinator',
      title_vi: 'Điều Phối Viên Sự Kiện Cấp Cao',
      department_en: 'Events',
      department_vi: 'Sự Kiện',
      description_en: 'Lead end-to-end planning and execution of high-profile weddings, corporate galas, and private celebrations. You will manage vendor relationships, oversee on-site logistics, and ensure every event meets our exacting luxury standards. Minimum 3 years of experience in upscale event planning required. Excellent communication skills in English and Vietnamese essential.',
      description_vi: 'Dẫn dắt lên kế hoạch và thực hiện từ đầu đến cuối các đám cưới danh tiếng, dạ tiệc doanh nghiệp và các buổi kỷ niệm riêng tư. Bạn sẽ quản lý mối quan hệ nhà cung cấp, giám sát hậu cần tại chỗ và đảm bảo mọi sự kiện đáp ứng các tiêu chuẩn sang trọng nghiêm ngặt của chúng tôi. Yêu cầu tối thiểu 3 năm kinh nghiệm trong lập kế hoạch sự kiện cao cấp. Kỹ năng giao tiếp xuất sắc bằng tiếng Anh và tiếng Việt là điều cần thiết.',
      type: 'Full-time'
    },
    {
      title_en: 'Digital Marketing Executive',
      title_vi: 'Chuyên Viên Marketing Kỹ Thuật Số',
      department_en: 'Marketing',
      department_vi: 'Marketing',
      description_en: 'Drive our digital presence across social media, SEO, and paid advertising channels. Create compelling visual content that captures the essence of our luxury brand and engages our target audience of couples, corporate clients, and high-net-worth individuals. Proficiency in Adobe Creative Suite, Google Analytics, and Meta Ads Manager required.',
      description_vi: 'Thúc đẩy sự hiện diện kỹ thuật số của chúng tôi trên mạng xã hội, SEO và các kênh quảng cáo trả phí. Tạo nội dung hình ảnh hấp dẫn nắm bắt bản chất thương hiệu sang trọng của chúng tôi và gắn kết đối tượng mục tiêu gồm các cặp đôi, khách hàng doanh nghiệp và cá nhân có thu nhập cao. Yêu cầu thành thạo Adobe Creative Suite, Google Analytics và Meta Ads Manager.',
      type: 'Full-time'
    },
    {
      title_en: 'Guest Relations Manager',
      title_vi: 'Quản Lý Quan Hệ Khách',
      department_en: 'Hospitality',
      department_vi: 'Khách Sạn',
      description_en: 'Be the face of Minh Đức Events, ensuring every guest interaction reflects our commitment to exceptional hospitality. Manage client inquiries, coordinate pre-event consultations, and maintain our VIP guest database. Previous luxury hospitality experience is essential. Fluency in English, Vietnamese, and ideally one additional language.',
      description_vi: 'Là bộ mặt của Minh Đức Events, đảm bảo mọi tương tác với khách phản ánh cam kết của chúng tôi về sự hiếu khách đặc biệt. Quản lý yêu cầu của khách hàng, điều phối các buổi tư vấn trước sự kiện và duy trì cơ sở dữ liệu khách VIP của chúng tôi. Kinh nghiệm khách sạn sang trọng trước đây là điều cần thiết. Thành thạo tiếng Anh, tiếng Việt và lý tưởng là thêm một ngôn ngữ nữa.',
      type: 'Full-time'
    },
    {
      title_en: 'Chef de Cuisine',
      title_vi: 'Bếp Trưởng',
      department_en: 'Culinary',
      department_vi: 'Ẩm Thực',
      description_en: 'Lead our award-winning kitchen team in creating extraordinary culinary experiences for weddings, galas, and private dining events. Develop seasonal menus that celebrate both Vietnamese culinary heritage and international fine dining traditions. Minimum 5 years of experience in 5-star hotel or Michelin-level restaurant kitchens required. Formal culinary training from a recognized institution preferred.',
      description_vi: 'Dẫn dắt đội ngũ nhà bếp từng đoạt giải thưởng của chúng tôi trong việc tạo ra những trải nghiệm ẩm thực phi thường cho đám cưới, dạ tiệc và các sự kiện ăn tối riêng tư. Phát triển thực đơn theo mùa tôn vinh cả di sản ẩm thực Việt Nam và các truyền thống ăn uống tinh tế quốc tế. Yêu cầu tối thiểu 5 năm kinh nghiệm trong bếp khách sạn 5 sao hoặc nhà hàng cấp Michelin. Ưu tiên đào tạo ẩm thực chính quy từ cơ sở được công nhận.',
      type: 'Full-time'
    },
    {
      title_en: 'Operations Supervisor',
      title_vi: 'Giám Sát Vận Hành',
      department_en: 'Operations',
      department_vi: 'Vận Hành',
      description_en: 'Oversee the day-to-day operational excellence of our venue, managing a team of service staff, coordinating with event teams, and ensuring all facilities meet the highest standards of presentation and functionality. Strong leadership skills, attention to detail, and a passion for luxury hospitality are essential. Experience in venue or hotel operations management preferred.',
      description_vi: 'Giám sát sự xuất sắc vận hành hàng ngày của địa điểm của chúng tôi, quản lý đội ngũ nhân viên phục vụ, phối hợp với các đội sự kiện và đảm bảo tất cả các cơ sở đáp ứng các tiêu chuẩn cao nhất về trình bày và chức năng. Kỹ năng lãnh đạo mạnh, chú ý đến chi tiết và đam mê về khách sạn sang trọng là điều cần thiết. Ưu tiên kinh nghiệm quản lý vận hành địa điểm hoặc khách sạn.',
      type: 'Full-time'
    }
  ];

  const insertMany = db.transaction((jobs) => {
    for (const job of jobs) {
      insertCareer.run(
        job.title_en, job.title_vi, job.department_en, job.department_vi,
        job.description_en, job.description_vi, job.type
      );
    }
  });
  insertMany(jobs);
}

// Seed admin user
const bcrypt = require('bcryptjs');
const adminCount = db.prepare('SELECT COUNT(*) as cnt FROM admin_users').get();
if (adminCount.cnt === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

module.exports = db;
