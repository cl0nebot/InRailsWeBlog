I18n.translations || (I18n.translations = {});
I18n.translations["en"] = I18n.extend((I18n.translations["en"] || {}), {"js":{"activities":{"article":{"create":"Article created","destroy":"Article removed","update":"Article updated"},"bookmarked_article":{"create":"Article bookmarked","destroy":"Bookmark article removed"},"comment":{"create":"Comment created","destroy":"Comment removed","update":"Comment updated"},"no_activities":"No activities to display","tag":{"create":"Tag created","destroy":"Tag removed","update":"Tag updated"},"tagged_article":{"create":"Article tagged","destroy":"Tag article removed","update":"Tag article updated"}},"admin":{"menu":{"back_home":"Back to homepage","dashboard":"Dashboard","errors":"Errors","sidekiq":"Sidekiq","users":"Users"},"users":{"index":{"title":"Users list"},"show":{"title":"User details"}}},"article":{"bookmark":{"added":"Article added to bookmarks","removed":"Article removed from bookmarks"},"clipboard":{"toast":{"done":"A new draft article has been created!","init":"Paste on website detected, new draft article creation in progress..."}},"common":{"allow_comment":{"falsy":"Non","title":"Autoriser les commentaires ?","truthy":"Oui"},"link":"Est un lien ?","tags":{"default":"ajouter des labels à l'article","url":"Label :"},"draft":"Note temporaire ?","tooltips":{"content_too_short":"Le contenu est trop court","summary_too_short":"Le résumé est trop court","title_too_short":"Le titre est trop court"},"url":"Liste des articles","validation_error":{"common":"Merci de remplir l'article comme indiqué avant de continuer"},"visibility":"Choisissez la visibilité"},"edit":{"exit":"Are you sure to exit without saving?","form_title":"Update of: %{title}","submit":"Update article","title":"Article update"},"enums":{"visibility":{"everyone":"Public","only_me":"Private"},"visibility_order":["everyone","only_me"]},"errors":{"content":{"size":"Le contenu de l'article doit être compris entre %{min} et %{max} caractères"},"name":{"size":"Le titre de l'article doit être compris entre %{min} et %{max} caractères"},"not_authorized":"Vous n'avez pas la permission d'accéder à cette article !","summary":{"size":"Le résumé de l'article doit être compris entre %{min} et %{max} caractères"}},"flash":{"creation_unpermitted":"Please connect before writing an article","deletion_successful":"Article deleted.","undelete_link":"Cancel deletion."},"history":{"changed_at":"Version changed","none":"No history for this article!","restore":"Restore this version","restored":"Version restored"},"model":{"allow_comment":"Allow comments ?","comment":{"false":"Deactivated","true":"Activated"},"content":"Content","link":"Is a link?","summary":"Summary","tags":"Labels associés","draft":"Draft note?","title":"Title","visibility":"Visibility"},"new":{"exit":"Are you sure to exit without saving?","submit":"Create article","tags":{"placeholder":"Associate tags","title":"Add tags (right click: parent tag / left click: children tag)"},"title":"Create a new article"},"timeline":{"no_articles":"No articles to display","title":"New article:"},"tooltip":{"add_bookmark":"Add to bookmarks","cancel":"Cancel","delete":"Remove this article","edit":"Modify article","history":"See article history","link":"This is a link","link_to":"Go to article","remove_bookmark":"Remove from bookmarks","update":"Update article","updated_at":"Last modification","visibility":"Visibility: %{visibility}"}},"buttons":{"apply":"Submit","cancel":"Cancel","custom":"Custom"},"categorized_tag":{"add_new":"Ajouter nouveau"},"checkbox":{"false":"Off","true":"On"},"comment":{"common":{"actions":"Actions","empty":"No comments yet","title":"Comments"},"delete":{"action":"To remove a comment, shift me!","button":"Delete"},"edit":{"button":"Modify"},"errors":{"body":"Comment message is %{message}","default":"Can not create comment! Please retry.","not_authorized":"You are not authorized to access to this comment","title":"Comment title is %{message}"},"flash":{"creation_unpermitted":"You must login to post a comment"},"form":{"comment":{"message":"Your comment...","notation":"Notation:","title":"Comment title"},"explanation":"To write your message, you can use ","submit":"Post","syntax":"markdown syntax","title":{"default":"Add a comment","modify":"Modify your comment","reply":"Reply to a comment"}},"model":{"body":"Message","commentable_type":"Model commenté","posted_at":"Posté le","title":"Titre","user":"Commentateur"},"new":{"button":"Add a comment"},"reply":{"button":"Reply"},"table":{"actions":{"accepted":"Valider le commentaire","button":"Actions","delete":"Supprimer ce commentaire","delete_permanently":"Supprimer DÉFINITIVEMENT ce commentaire","show":"Voir le commentaire"},"confirmation":{"delete":"Supprimer le commentaire '%{comment}'","delete_permanently":"Supprimer DÉFINITIVEMENT le commentaire '%{comment}' ?"},"filter":{"accepted":"Validé","button":"Filter","order":{"select":{"default":"Sélectionner la colonne","order":["id_first","id_last","updated_first","updated_last"],"values":{"id_first":"Id (premier)","id_last":"Id (dernier)","updated_first":"Mise à jour (premier)","updated_last":"Mise à jour (dernier)"}},"title":"Trier par"}},"helper":"Pour éditer les commentaires directement depuis la liste, double cliquer sur le texte. Sinon dans Actions, cliquer sur édition."},"timeline":{"link":"Comment associated to:","no_comments":"No comments to display"},"tooltip":{"count":"%{number} comments"}},"date":{"abbr_day_names":["Su","Mo","Tu","We","Th","Fr","Sa"],"abbr_month_names":["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Dec"],"day_names":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"formats":{"date":"yyyy-mm-dd","default":"MM/DD/YYYY","display":"MMMM D","editable":"The dd MM at hh:ii","editable_date":"The dd MM"},"label":{"from":"From","to":"To"},"letter_day_names":["S","M","T","W","T","F","S"],"month_names":["January","February","March","April","May","June","July","August","September","October","November","December"],"ranges":{"custom_range":"Custom range","next_month":"Next Month","next_week":"Next 7 days","previous_month":"Mois précédent","select_month":"Sélectionner un mois","select_year":"Sélectionner une année","this_month":"This Month","today":"Today","today_short":"Tod.","tomorrow":"Tomorrow"},"separator":" to "},"error_message":{"message":"Message:","trace":"Trace:","url":"URL:"},"errors":{"not_authorized":"You are not authorized to access to this resource","server":"A server error happened, please retry later."},"footer":{"copyright":"Copyright 2015 - InRailsWeBlog. tous droits réservés.","description":"Un blog pensé pour les développeurs","links":{"about":"A propos de moi","contact":"Me contacter par email","github":"Source sous Github","github_src":"https://github.com/floXcoder/InRailsWeBlog","support":"Aide","title":"Liens utiles"},"title":"In Rails We Blog"},"form":{"errors":{"date":"Indiquer une date valide","datetime":"Indiquer une date et une heure valide","phone_number":"Numéro de téléphone invalide","picture":{"text":"La taille du fichier dépasse 5Mo, veuillez choisir une image plus petite","title":"Image trop grande"},"select":"Choisissez une des options proposées","stripped_text_size":"La taille du texte doit être compris entre %{minCount} et %{maxCount} caractères","text":"Ce champ est requis"},"wizard":{"next":"Suivant","previous":"Précédent"}},"header":{"articles":{"button":"Articles","menu":{"bookmark":"Articles favoris","new":"Nouvel article","draft":"Temporaires","user":"Mes articles"}},"settings":{"button":"Préférences"},"search":{"button":"Rechercher"},"tags":{"button":"Labels"},"user":{"administration":"Administration","languages":{"english":"English","french":"Français"},"log_in":"Se connecter","log_out":"Déconnexion","profile":"Mon compte","sign_up":"S'inscrire"}},"helpers":{"and":" et ","array":{"last_word_connector":" et ","two_words_connector":" et ","words_connector":", "},"back":"Page précédente","colon":" : ","or":" ou ","select":{"prompt":"Veuillez sélectionner"},"submit":{"create":"Créer un(e) %{model}","submit":"Enregistrer ce(tte) %{model}","update":"Modifier ce(tte) %{model}"}},"language":{"english":"English","french":"French"},"picture":{"model":{"errors":{"text":"Maximum file size is 5MB. Please choose a smaller file","title":"Picture too big","type":{"image":"Le fichier n'est pas de type image, merci de choisir un fichier jpp, jpeg, png ou bmp"}}}},"rating":{"clear":"Effacer"},"search":{"no_results":{"content":"Try something else :)","title":"No articles found"},"placeholder":"Search...","url":"Search:"},"tag":{"common":{"associated":"Associated tags","filter":"Filter by Tag...","list":"All tags","no_results":"No tags found for:"},"enums":{"visibility":{"everyone":"Public","only_me":"Private"},"visibility_order":["everyone","only_me"]}},"time":{"abbr_hour":"h","abbr_minute":"m"},"tracking":{"bookmarks_count":"Bookmarks","clicks_count":"Clicks","queries_count":"Queries","searches_count":"Searches","sign_in_count":"Connections","views_count":"Views"},"user":{"errors":{"email":{"already_taken":"is already taken, please choose another","format":"Your email address is invalid","required":"Please enter an email address"},"login":{"invalid":"doesn't exist, please enter a valid email address or pseudo","required":"Please enter your email or pseudo"},"password":{"mismatch":"Password and password confirmation mismatch","required":"Please enter a password","size":"Your Password must be %{min} and %{max} characters"},"policy":"Please agree to our policy","pseudo":{"already_taken":"is already taken, please choose another","required":"Please enter a pseudo","size":"Your Pseudo must be %{min} and %{max} characters"}},"index":{"link_to_user":"User details","search":"Find user"},"login":{"cancel":"Cancel","login":"Pseudo or Email","password":"Password","remember_me":"Remember me","submit":"Log in","title":"Log In"},"model":{"additional_info":"Personal information","admin":"Administrator","age":"Age","city":"City","country":"Country","created_at":"Creation date of account","email":"Email","first_name":"First name","last_name":"Last name","last_sign_in_at":"Last connection","locale":"Language","pseudo":"Pseudo"},"settings":{"article":{"display":{"mode":{"card":"Display each articles within cards","inline":"Display only one article"},"title":"Articles"},"title":"Articles"},"search":{"exact":"Exact word(s)","highlight":"Highlight","operator":{"mode":{"and":"All words","or":"At least one word"},"title":"Operator"},"title":"Search"}},"show":{"about":"About","activities":"Activities","admin":"Administrator","administrator":{"false":"No admin","true":"Admin power"},"articles":"Articles","comments":"Comments","contact":"Contact Info","is_admin":"Administrator","more_actions":"Actions","not_admin":"Not an administrator","properties":"Propriétés","tracking":"Tracking"},"signup":{"cancel":"Cancel","confirm_password":"Password checking","email":"Email","password":"Password","pseudo":"Pseudo","submit":"Create my account","terms_of_use":"By subscribing on InRailsWeBlog, you accept our","terms_of_use_name":"terms of use.","title":"Create an account"}}}});
I18n.translations["fr"] = I18n.extend((I18n.translations["fr"] || {}), {});
