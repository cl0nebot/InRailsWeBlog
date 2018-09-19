I18n.translations || (I18n.translations = {});
I18n.translations["en"] = {"js":{"helpers":{"home":"Home","colon":": ","or":" or ","and":" and ","back":"Previous page","buttons":{"apply":"Apply","cancel":"Cancel"},"select":{"prompt":"Please select"},"array":{"last_word_connector":" and ","two_words_connector":" and ","words_connector":", "},"form":{"ensure_validity":"Leave it blank"},"not_found":{"title":"Path not found!"},"not_authorized":{"title":"You cannot access to this element"},"errors":{"not_authorized":"You cannot access to this resource!","frontend":"An error occurred in the page, please refresh the page or go back","unprocessable":"Cannot process this element, incorrect data","boundary":{"title":"Cannot display the component","message":"Please reload the page.","header":"Cannot display the header","footer":"Cannot display the footer"},"server":"A server error occurred, please retry later"}},"date":{"formats":{"default":"MM/DD/YYYY","display":"MMMM D","editable":"The dd MM at hh:ii","editable_date":"The dd MM","date":"yyyy-mm-dd"},"buttons":{"apply":"Apply","cancel":"Cancel","clear":"Clear","close":"Fermer"},"separator":" to ","label":{"from":"From","to":"To"},"ranges":{"today":"Today","today_short":"Today","tomorrow":"Tomorrow","next_week":"Next 7 days","previous_month":"Prev. month","this_month":"This Month","next_month":"Next Month","custom_range":"Custom range","select_month":"Select month","select_year":"Select year"},"day_names":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"abbr_day_names":["Su","Mo","Tu","We","Th","Fr","Sa"],"letter_day_names":["S","M","T","W","T","F","S"],"month_names":["January","February","March","April","May","June","July","August","September","October","November","December"],"abbr_month_names":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},"cookies":{"message":"Welcome to InRailsWeBlog! This website uses cookies to ensure you get the best experience on our website. ","link":"More info","validation":"Got it!"},"views":{"home":{"loader":"Loading"},"header":{"title":"InRailsWeBlog","topic":{"button":"Topics (%{current})","title":"Your topics","add":"Add a new topic"},"search":{"button":"Search"},"article":{"button":"Articles","menu":{"temporary":"Article en cours","add_note":"Take a note","add_article":"Write a story","add_link":"Add a link","user":"My articles","new":"New article","bookmark":"Bookmarked articles","draft":"Drafts"}},"tags":{"button":"Tags"},"settings":{"button":"Settings"},"user":{"settings":"My parameters","sign_up":"Sign up","log_in":"Log in","log_out":"Log out","languages":{"french":"French","english":"English"},"profile":"My account","administration":"Administration"}},"sidebar":{"pin":"Pin","unpin":"Unpin"},"footer":{"title":"In Rails We Blog","description":"A blog for developer","copyright":"Copyright 2018 - InRailsWeBlog (%{version}). All rights reserved.","links":{"title":"Links","contact":"Contact us by email","support":"Help","about":"About us","github":"Github","github_src":"https://github.com/floXcoder/InRailsWeBlog"}}},"topic":{"common":{"visibility":"Choose visibility","user_topics":"My topic","user_current_topic":"Current topic"},"model":{"name":"Name","visibility":"Visibility"},"enums":{"visibility":{"everyone":"Public","only_me":"Private"},"visibility_order":["everyone","only_me"]},"new":{"title":"Add a topic","input":"Topic name","cancel":"Cancel","submit":"Add topic"},"edit":{"title":"Update topic","input":"Theme name","delete":"Delete","submit":"Update"}},"article":{"common":{"draft":"Draft?","link":"Link?","allow_comment":{"title":"Allow comments?","truthy":"Yes","falsy":"No"},"visibility":"Choose visibility","url":"Articles list","outdated":"Article marked as outdated","advanced":"Advanced options","user":"Posted by","actions":"Actions","not_connected":{"message":"Please log in, before posting article"},"infinite":{"loading":"Loading articles"},"placeholders":{"title":{"story":"Article title"},"reference":{"note":"URL reference","story":"URL reference","link":"URL to reference"},"content":{"story":"Article content","note":"New content","link":"Link description"}},"tags":{"default":"Add labels to article","parent":"Main labels","child":"Secondary labels","placeholder":"Add label name","add":"Add the label:","none":"without tags"},"tooltips":{"title_too_short":"Title too short","summary_too_short":"Summary too short","content_too_short":"Content too short"},"no_results":{"topic":{"title":"No articles for this topic","content":"You can add a new article in this topic","button":"Add an article"},"search":{"title":"No articles found","content":"Try something else :)"}},"validation_error":{"common":"Please correct errors before submitting"}},"form":{"unsaved":"Leave without saving article?"},"model":{"title":"Title","summary":"Summary","content":"Content","reference":"Link","language":"Language","visibility":"Visibility","allow_comment":"Allow comments","draft":"Draft","tags":"Tags","parent_tags":"Main tags","child_tags":"Secondary tags","comment":{"true":"Enabled","false":"Disabled"},"topic":"Topic","tagged_articles":{"tag":{"name":"Tag associated to the article"}}},"enums":{"visibility":{"everyone":"Public","only_me":"Private"},"visibility_order":["everyone","only_me"],"mode":{"story":"Story","note":"Note","link":"Link"}},"flash":{"creation_unpermitted":"Please connect before writing an article","deletion_successful":"Article deleted.","undelete_link":"Cancel deletion."},"tooltip":{"edit":"Modify article","visibility":"Visibility: %{visibility}","add_bookmark":"Add to bookmarks","remove_bookmark":"Remove from bookmarks","add_outdated":"Mark as outdated","remove_outdated":"Remove from outdated","history":"See article history","link":"This is a link","link_to":"Go to article","cancel":"Cancel","update":"Update","delete":"Remove this article","updated_at":"Last modification"},"history":{"changed_at":"Version changed","restore":"Restore this version","none":"No history for this article!","restored":"Version restored"},"bookmark":{"added":"Article added to bookmarks","removed":"Article removed to bookmarks"},"outdated":{"added":"Article marked as outdated","removed":"Article removed from bookmarks"},"vote":{"added":"Vote added"},"show":{"new_tags":"Add synonyms or description to new tags:"},"new":{"title":"Create a new article","tags":{"title":"Add tags (right click: parent tag / left click: children tag)","placeholder":"Associate tags"},"submit":"Create article","exit":"Are you sure to exit without saving?"},"edit":{"title":"Article update","form_title":"Update of: %{title}","submit":"Update","exit":"Are you sure to exit without saving?"},"sort":{"title":"Sort by","order":{"priority":"Priority","tag":"Tag","date_desc":"Most recent","date_asc":"Oldest"},"link_title":"Change order","link":"Change priority"},"filter":{"title":"Filter by","filters":{"story":"Stories","note":"Notes","link":"Links","bookmark":"Bookmarks","draft":"Drafts"}},"timeline":{"title":"New article:","no_articles":"No articles to display"},"clipboard":"A draft article has been created with the data","errors":{"default":"Cannot create article! Please try again.","not_authorized":"Cannot access to this article!","title":{"size":"Article title must be between %{min} and %{max} characters"},"summary":{"size":"Article summary must be between %{min} and %{max} characters"},"content":{"size":"Article content must be between %{min} and %{max} characters"},"topic":"No topics for this article","bookmark":{"not_authorized":"Cannot add to bookmarks","default":"Cannot add to bookmarks! Try to reload the page.","bookmark":"%{message}"}}},"tag":{"common":{"list":"Tags","associated":"Associated tags","filter":"Filter by tags...","no_tags":"Not tag yet for this topic","no_results":"No tags for:","usage":"%{count} use","link":"See tag details","visibility":"Choose visibility","visibility_immutable":"Public tag name cannot be changed","synonyms":"Tag synonyms...","no_description":"No tag description","no_synonyms":"No tag synonyms","no_parents":"No parents tag","no_children":"No children tag","publics":"Public tags","privates":"Private tags","no_publics":"No public tags","no_privates":"No private tags","placeholders":{"name":"Tag name","description":"Tag description"},"stats":{"title":"Statistics","views":"Views: ","clicks":"Clicks: ","searches":"Searches: "}},"form":{"unsaved":"Leave without saving tag?"},"model":{"name":"Tag name","description":"Description","synonyms":"Synonyms","visibility":"Visibility","owner":"Owner","articles_count":"Articles count","parents":"Parents tag","children":"Children tag"},"enums":{"visibility":{"everyone":"Public","only_me":"Private"},"visibility_order":["everyone","only_me"]},"index":{"titles":{"topic":"Tags for the current topic: %{topic}","user":"All your tags","all":"All public tags"},"sort":"Sort your tags by priority","links":{"user_tags":"See all your used tags","all_tags":"See all public tags"}},"show":{"back_button":"Cancel","edit_link":"Edit"},"new":{"title":"Tag creation","submit":"Create"},"edit":{"title":"Tag edition: %{name}","back_button":"Cancel","submit":"Update"},"errors":{"default":"Cannot create tag! Please try again.","not_authorized":"Cannot access to this tag!","name":{"size":"Tag name must be between %{min} and %{max} characters"},"description":{"size":"Tag description must be between %{min} and %{max} characters"}}},"user":{"model":{"pseudo":"Pseudo","first_name":"First name","last_name":"Last name","city":"City","country":"Country","additional_info":"Personal information","locale":"Language","admin":"Administrator","created_at":"Creation date of account","email":"Email","last_sign_in_at":"Last connection"},"login":{"title":"Log In","login":"Pseudo or Email","password":"Password","remember_me":"Remember me","cancel":"Cancel","submit":"Log in","connecting":"Connecting in progress","connected":"Redirection to your account","externals":{"google":"Login with Google","facebook":"Login with Facebook"}},"signup":{"title":"Create an account","pseudo":"Pseudo","email":"Email","password":"Password","confirm_password":"Password checking","terms_of_use":"By subscribing on InRailsWeBlog, you accept our","terms_of_use_name":"terms of use.","cancel":"Cancel","submit":"Create my account","connecting":"Subscribing in progress","connected":"Redirection to your account","externals":{"google":"Signup with Google","facebook":"Signup with Facebook"}},"index":{"link_to_user":"User details","search":"Find user"},"show":{"more_actions":"Actions","articles":"Articles","tag":"Tags","comments":"Comments","about":"About","activities":"Activities","tracking":"Tracking","contact":"Contact Info","properties":"Properties","edit":"Edit","admin":"Administrator","administrator":"Administrator","is_admin":"Is admin","not_admin":"Not admin"},"edit":{"page_title":"Edit my profile","title":"Edit my profile","login_header":"Connection information","connection_parameters":"Modifier vos paramètres de connexion","profile_picture":"Profile picture","current_picture":"Your current picture:","replace_picture":"You can replacer your picture with a local one or using an url","no_picture":"You have no picture for your profile","local_picture":"Local image","remote_picture":"Picture URL","or":"or","placeholder_picture":"Use a local picture or a remote url","remove_picture":"Remove this picture","personal_information_header":"Personal information","update_profile":"Update my profile","back_button":"Back"},"errors":{"login":{"required":"Please enter your email or pseudo","invalid":"doesn't exist, please enter a valid email address or pseudo"},"pseudo":{"required":"Please enter a pseudo","size":"Your Pseudo must be %{min} and %{max} characters","already_taken":"is already taken, please choose another"},"email":{"required":"Please enter an email address","invalid":"Your email address is invalid","already_taken":"is already taken, please choose another"},"password":{"required":"Please enter a password","size":"Your Password must be %{min} and %{max} characters","mismatch":"Password and password confirmation mismatch"},"policy":"Please agree to our policy"},"settings":{"article":{"title":"Articles","loader":{"title":"Articles loading","mode":{"infinite":"Display articles on scroll","pagination":"Use pagination","all":"Display all"}},"display":{"title":"Articles","mode":{"inline":"On global article","card":"Independent cards","grid":"In grid"}},"child_tagged":{"title":"Display child articles with parent tag"}},"tag":{"title":"Tags","sidebar":{"title":"Sidebar","with_child":"Display tag children in main list","pin":"Sidebar open by default"},"order":{"title":"Tags order by default","mode":{"name":"Name","priority":"Priority"}}},"search":{"title":"Search","operator":{"title":"Operator","mode":{"and":"All words","or":"At least one word"}},"highlight":"Highlight","exact":"Exact word(s)"}}},"search":{"filters":{"priority":"Priority","date":"Date","all_topics":"For all topics"},"module":{"placeholder":"Search","button":"Search","tags":{"title":"Tags"},"articles":{"title":"Articles"}},"index":{"placeholder":"Search","button":"Trouver","results":{"one":"1 result","other":"%{count} results"},"suggestions":{"tags":"Try with the following tags:","articles":"Try with the spelling:"},"filters":{"button":"Filter by"},"articles":{"title":"Articles"}}},"editor":{"buttons":{"code":"Simple code","pre":"Multi-line code (CTRL+E)","advice":"Advice","secret":"Secret","cleaner":"Clean formatting"}},"comment":{"common":{"route":"comments","title":"Comments","empty":"Be the first to post your comment!","no_opinion":"No users posted a comment yet","actions":"Actions","loading":"Loading comments...","no_data":"No comments to display"},"model":{"title":"Title","body":"Message","user":"User","commentable_type":"Model commented","posted_at":"Posted at"},"tooltip":{"count":"%{count} comments"},"timeline":{"link":"Comment associated to:","no_comments":"No comments to display"},"table":{"helper":"To edit comments from list, double click on text. Or click in Actions and edit button.","filter":{"order":{"title":"Sort by","select":{"default":"Select column","values":{"id_asc":"Id (first)","id_desc":"Id (last)","updated_asc":"Updated (first)","updated_desc":"Updated (last)"},"order":["id_asc","id_desc","updated_asc","updated_desc"]}},"not_accepted":"Not accepted only","ask_for_deletion":"Ask for deletion","button":"Filter"},"actions":{"button":"Actions","show":"See comment","accepted":"Apply","delete":"Remove this comment","delete_permanently":"Remove PERMANENTLY this comment"},"confirmation":{"delete":"Remove comment '%{comment}'","delete_permanently":"Remove PERMANENTLY this comment '%{comment}'?"}},"form":{"title":{"default":"Add a comment","modify":"Modify your comment","reply":"Reply to comment","owner_reply":"Reply to comment as owner","deletion_reply":"Ask to remove this comment"},"explanation":"To write your message, you can use ","syntax":"markdown syntax","comment":{"title":"Comment title","body":"Your comment ...","title_for_deletion":"Ask for deletion","body_for_deletion":"Deletion reason","notation":"Note:"},"cancel":"Cancel","submit":"Post"},"new":{"button":"Add a comment"},"reply":{"owner":"Owner answer","button":"Reply","owner_button":"Reply as owner","ask_for_deletion":"Ask for deletion in progress"},"edit":{"button":"Modify"},"delete":{"button":"Delete","confirmation_message":"Confirm deletion","confirmation_button":"Deletion"},"ask_for_deletion":{"button":"Ask for deletion of a comment"},"flash":{"creation_unpermitted":"You must login to post a comment"},"errors":{"default":"Can not create comment! Please retry.","not_authorized":"You are not authorized to access to this comment","title":{"size":"Comment title must be between %{min} and %{max} characters"},"body":{"size":"Comment body must be between %{min} and %{max} characters"}}},"bookmark":{"common":{"add":"Add to bookmarks","remove":"Remove from bookmarks","added":{"user":"User added to bookmarks","topic":"Topic added to bookmarks","tag":"Tag added to bookmarks","article":"Article added to bookmarks"},"removed":{"user":"User removed from bookmarks","topic":"Topic removed from bookmarks","tag":"Tag removed from bookmarks","article":"Article removed from bookmarks"}},"notification":{"text":"Bookmark added ajouté","link":"My bookmarks","saved_later":"You are not connected. Bookmarks will be added after connection.","connection":"Log in","not_connected":"You must be connected to add or remove bookmarks"},"list":{"title":"Vos favoris","none":"Aucun favoris"}},"checkbox":{"truthy":"Yes","falsy":"No"},"languages":{"fr":"Français","en":"English"},"selecter":{"no_results":"No results found","tags":{"type":"Type characters to add a tag","add":"Add","already_exists":"Tag already exist","too_long":"Name too long"}}}};
